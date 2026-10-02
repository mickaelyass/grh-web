import { Alert } from '../../../ui/Alert'
import { Button } from '../../../ui/Button'
import { Form, FormInput, FormLabel } from '../../../ui/Form'
import { Col, Row } from '../../../ui/Grid'
import React from 'react';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

const PosteAnterieurForm = ({info,handle}) => {
  const lastInfo = Array.isArray(info) && info.length > 0 ? info[info.length - 1] : {};

  const formatDate = (dateString) => {
    if (!dateString) return ''; // Return an empty string for invalid dates
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format as yyyy-MM-dd
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nom_poste:lastInfo?.nom_poste|| '',
      date_debut:formatDate(lastInfo?.date_debut)|| '',
      date_fin:formatDate(lastInfo?.date_fin)|| '',
      institution: lastInfo?.institution||'',
      //infop: ''
    },
    validationSchema: Yup.object({
      nom_poste: Yup.string().required('Le nom du poste est requis'),
      date_debut: Yup.date().required('La date de début est requise'),
      date_fin: Yup.date().required('La date de fin est requise'),
      institution: Yup.string().required('L\'institution est requise'),
     //infop: Yup.string().required('L\'information complémentaire est requise')
    }),
    onSubmit: (values) => {
      console.log(values);
      try {
        console.log('Données soumises:', values);
        handle(values);
      } catch (error) {
        console.error('Erreur lors de la soumission du formulaire:', error);
      }
    }
  });
  

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Row>
        {[
          { id: 'nom_poste', label: 'Nom du poste', type: 'text' },
          { id: 'date_debut', label: 'Date de début', type: 'date' },
          { id: 'date_fin', label: 'Date de fin', type: 'date' },
          { id: 'institution', label: 'Institution', type: 'text' },
          /* { id: 'infop', label: 'Information complémentaire', type: 'text' } */
        ].map((field) => (
          <Col xs={12} md={6} key={field.id} className="mb-3">
            <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
            <FormInput
              id={field.id}
              name={field.id}
              type={field.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values[field.id]}
              invalid={formik.touched[field.id] && !!formik.errors[field.id]}
            />
            {formik.touched[field.id] && formik.errors[field.id] && (
              <Alert color="danger">{formik.errors[field.id]}</Alert>
            )}
          </Col>
        ))}
        <Col xs={12} className="mt-3">
          <Button type="submit" color="primary" disabled={!formik.isValid || formik.isSubmitting}>
            Ajouter
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default PosteAnterieurForm;
