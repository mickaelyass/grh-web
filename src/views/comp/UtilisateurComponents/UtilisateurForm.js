import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field } from '../../../forms';

const schema = z
  .object({
    matricule: z.string().min(1, 'Matricule requis'),
    role: z.string().optional(),
    password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    confirmPassword: z.string().min(1, 'Confirmez le mot de passe'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Les mots de passe ne correspondent pas',
  });

const UtilisateurForm = ({ user, onSubmit }) => {
  const initialValues = {
    matricule: user ? user.matricule : '',
    role: user ? user.role : 'user',
    password: '',
    confirmPassword: '',
  };

  const { control, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: user || initialValues,
    resolver: zodResolver(schema),
    mode: 'onTouched',
  });

  const submit = (values) => {
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <div className="form-group">
        <Field control={control} name="matricule" label="Matricule" required />
      </div>

      <div className="form-group">
        <Field control={control} name="password" label="Mot de passe" type="password" required />
      </div>

      <div className="form-group">
        <Field control={control} name="confirmPassword" label="Confirmer le mot de passe" type="password" required />
      </div>

      <button type="submit" className="btn btn-success bg-clair px-5 mt-3" disabled={isSubmitting}>
        S'inscrire
      </button>
    </form>
  );
};

export default UtilisateurForm;
