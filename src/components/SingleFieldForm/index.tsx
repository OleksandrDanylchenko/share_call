import { ReactElement, KeyboardEvent, useEffect } from 'react';
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
import { typeToFlattenedError } from 'zod/lib/ZodError';

import { fullWidth, textFieldEllipsis } from '@/styles/mixins';

type Props<TFieldValues extends FieldValues> = {
  formProps: FormContainerProps<TFieldValues> & {
    formContext: UseFormReturn<TFieldValues>; // Makes property required
  };
  textFieldProps: TextFieldElementProps<TFieldValues>;
  ellipsis?: boolean;

  loading?: boolean;
  error?: typeToFlattenedError<TFieldValues>['fieldErrors'];
};

function SingleFieldForm<TFieldValues extends FieldValues>(
  props: Props<TFieldValues>,
): ReactElement {
  const { formProps, textFieldProps, ellipsis, loading, error } = props;
  const {
    formContext: { getValues, reset, setError },
    onSuccess,
  } = formProps;

  const [editing, toggleEditing, setEditing] = useToggle(false);

  const handleCancelEditing = (): void => {
    reset(undefined);
    setEditing(false);
  };

  const handleSuccessSubmit = (data: TFieldValues): void => {
    onSuccess?.(data);
    setEditing(false);
  };

  const handleKeydown = (event: KeyboardEvent): void => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      handleSuccessSubmit(getValues());
    }
  };

  useEffect(() => {
    if (error) {
      setEditing(true);
      ObjectTyped.entries(error).forEach(([field, messages]) =>
        setError(field as Path<TFieldValues>, {
          type: 'manual',
          message: first(messages),
        }),
      );
    }
  }, [error, setEditing, setError]);

  return (
    <Box css={fullWidth}>
      <FormContainer {...formProps} onSuccess={handleSuccessSubmit}>
        <TextFieldElement
          css={ellipsis && textFieldEllipsis}
          variant="standard"
          fullWidth
          required={editing}
          disabled={loading}
          onKeyDown={handleKeydown}
          {...textFieldProps}
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
            ...textFieldProps.InputProps,
          }}
        />
      </FormContainer>
    </Box>
  );
}

export default SingleFieldForm;
