import React, { ReactElement, useEffect } from 'react';
import { Path, UseFormReturn } from 'react-hook-form';
import {
  FormContainer,
  FormContainerProps,
  TextFieldElement,
  TextFieldElementProps,
} from 'react-hook-form-mui';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CreateIcon from '@mui/icons-material/Create';
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { first } from 'lodash';
import { ObjectTyped } from 'object-typed';
import { FieldValues } from 'react-hook-form/dist/types/fields';
import { useToggle } from 'usehooks-ts';

import { usePrevious } from '@/hooks/usePrevious';
import { fullWidth, textFieldEllipsis } from '@/styles/mixins';

type Props<TFieldValues extends FieldValues> = {
  formProps: FormContainerProps<TFieldValues> & {
    formContext: UseFormReturn<TFieldValues>; // Makes property required
  };
  textFieldProps: TextFieldElementProps<TFieldValues>;

  loading?: boolean;
  error?: Record<Path<TFieldValues>, string | string[] | undefined>;
};

function SingleFieldForm<TFieldValues extends FieldValues>(
  props: Props<TFieldValues>,
): ReactElement {
  const { formProps, textFieldProps, loading, error } = props;
  const {
    formContext: { reset, setError },
  } = formProps;

  const [editing, toggleEditing, setEditing] = useToggle(false);

  const handleCancelEditing = (): void => {
    reset(undefined);
    setEditing(false);
  };

  const prevLoading = usePrevious(loading);
  useEffect(() => {
    if (prevLoading && !loading && !error) {
      setEditing(false);
    }
  }, [error, prevLoading, loading, setEditing]);

  useEffect(() => {
    if (error) {
      ObjectTyped.entries(error).forEach(([field, message]) =>
        setError(field, {
          type: 'manual',
          message: typeof message === 'string' ? message : first(message),
        }),
      );
    }
  }, [error, setError]);

  return (
    <Box css={fullWidth}>
      <FormContainer {...formProps}>
        <TextFieldElement
          css={textFieldEllipsis}
          variant="standard"
          fullWidth
          required={editing}
          disabled={loading}
          InputProps={{
            readOnly: !editing,
            endAdornment: (
              <InputAdornment position="end">
                {loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <>
                    {editing && (
                      <IconButton
                        aria-label="Cancel editing"
                        size="small"
                        type="button"
                        onClick={handleCancelEditing}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      aria-label="Edit"
                      onMouseDown={!editing ? toggleEditing : undefined}
                      size="small"
                      type={editing ? 'submit' : 'button'}
                    >
                      {editing ? (
                        <CheckIcon fontSize="small" color="primary" />
                      ) : (
                        <CreateIcon fontSize="small" />
                      )}
                    </IconButton>
                  </>
                )}
              </InputAdornment>
            ),
          }}
          {...textFieldProps}
        />
      </FormContainer>
    </Box>
  );
}

export default SingleFieldForm;
