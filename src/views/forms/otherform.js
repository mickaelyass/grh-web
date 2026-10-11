import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field } from '../../forms';
import Button from '../../ui/Button';

// ---------------------------------------------------------------------------
//  OtherForm — création de compte avec choix du rôle.
//  Migré de Formik/Yup vers react-hook-form + zod. Rôles alignés sur le backend
//  (models/utilisateur.js : ENUM).
// ---------------------------------------------------------------------------

const ROLES = [
  { value: 'employe', label: 'Employé' },
  { value: 'chef_service', label: 'Chef de service' },
  { value: 'directrice', label: 'Directrice' },
  { value: 'admin', label: 'Administrateur' },
];

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

const OtherForm = ({ user, onSubmit }) => {
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

  const submit = (values) => onSubmit(values);

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <div className="mb-3">
        <Field control={control} name="matricule" label="Matricule" required />
      </div>

      <div className="mb-3">
        <Field
          control={control}
          name="role"
          label="Rôle"
          type="select"
          options={ROLES}
        />
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

export default OtherForm;
