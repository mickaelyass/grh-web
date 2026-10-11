import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field } from '../../forms';
import Button from '../../ui/Button';

// ---------------------------------------------------------------------------
//  UserForm — création de compte (matricule + mot de passe).
//  Migré de Formik/Yup vers react-hook-form + zod. La soumission est déléguée
//  UNIQUEMENT au formulaire (confirmPassword ne part pas au backend).
// ---------------------------------------------------------------------------

const schema = z
  .object({
    matricule: z.string().min(1, 'Le matricule est requis'),
    role: z.string().optional(),
    password: z
      .string()
      .min(1, 'Le mot de passe est requis')
      .min(8, 'Le mot de passe doit comporter au moins 8 caractères'),
    confirmPassword: z.string().min(1, 'La confirmation du mot de passe est requise'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Les mots de passe doivent correspondre',
  });

const UserForm = ({ user, onSubmit }) => {
  const initialValues = {
    matricule: user ? user.matricule : '',
    role: user ? user.role : 'employe',
    password: '',
    confirmPassword: '',
  };

  const { control, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: initialValues,
    resolver: zodResolver(schema),
    mode: 'onTouched',
  });

  const submit = (values) => {
    // confirmPassword n'a pas besoin d'aller au backend.
    const { confirmPassword, ...donnees } = values;
    return Promise.resolve(onSubmit(donnees));
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <div className="mb-3">
        <Field control={control} name="matricule" label="Matricule" required />
      </div>

      <div className="mb-3">
        <Field control={control} name="password" label="Mot de passe" type="password" required />
      </div>

      <div className="mb-3">
        <Field control={control} name="confirmPassword" label="Confirmez le mot de passe" type="password" required />
      </div>

      <Button type="submit" color="success" className="px-4 mt-3" disabled={isSubmitting}>
        S'inscrire
      </Button>
    </form>
  );
};

export default UserForm;
