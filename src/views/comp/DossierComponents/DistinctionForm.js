import { Alert } from '../../../ui/Alert'
import { Button } from '../../../ui/Button'
import { Form, FormInput, FormLabel } from '../../../ui/Form'
import { Col, Row } from '../../../ui/Grid'
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

const DistinctionForm = ({info,handle}) => {
  const [distinction, setDistinction] = useState(null);
  const lastInfo = Array.isArray(info) && info.length > 0 ? info[info.length - 1] : {};
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ref_distinction:lastInfo?.ref_distinction|| '',
      detail_distinction:lastInfo?.detail_distinction|| '',
     //infoc: ''
    },
    validationSchema: Yup.object({
      ref_distinction: Yup.string().required('La référence de la distinction est requise'),
      detail_distinction: Yup.string().required('Le détail de la distinction est requis'),
     // infoc: Yup.string().required('L\'information complémentaire est requise')
    }),
    onSubmit: (values) => {
      try {
        console.log('Données soumises:', values);
        handle(values);
      } catch (error) {
        console.error('Erreur lors de la soumission du formulaire:', error);
      }
    }
  });

  return (
    <Form className='my-2' onSubmit={formik.handleSubmit}>
      <Row>
        {[
          { id: 'ref_distinction', label: 'Référence de la distinction', type: 'text' },
          { id: 'detail_distinction', label: 'Détail de la distinction', type: 'text' },
          /* { id: 'infoc', label: 'Information complémentaire', type: 'text' } */
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

export default DistinctionForm;

