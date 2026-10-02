import { Alert } from '../../../ui/Alert'
import { Button } from '../../../ui/Button'
import { CardHeader } from '../../../ui/Card'
import { Form, FormInput, FormLabel } from '../../../ui/Form'
import { Col, Row } from '../../../ui/Grid'
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

const InfoBankForm = ({ onSubmite ,updateData, initial,setCanProceed }) => {
  const [infoBank, setInfoBank] = useState(null);

  const formik = useFormik({
    initialValues: {
      rib:initial?.rib|| '',
      mtn:initial?.mtn|| '',
      celtics:initial?.celtics|| '',
      moov:initial?.moov|| '',
    },
    validationSchema: Yup.object({
      rib: Yup.string().required('Le RIB est requis'),
      mtn: Yup.string().required('Le numéro MTN est requis'),
      celtics: Yup.string(),
      moov: Yup.string()
    }),
    onSubmit: (values) => {
      setInfoBank(values);
      console.log('Form submitted with values:', values);
      updateData(values);  // Appelle la fonction passée pour mettre à jour les données
       setCanProceed(true); 
      onSubmite(); // Appelle la fonction passée pour passer à l'étape suivante
    }
  });

  return (
    <div>
         <CardHeader className='mb-3'>
            <strong>Information Bancaire</strong>
      </CardHeader>
    <Form onSubmit={formik.handleSubmit}>
      <Row>
        {[
          { id: 'rib', label: 'RIB', type: 'text' },
          { id: 'mtn', label: 'MTN', type: 'text' },
          { id: 'celtics', label: 'Celtics', type: 'text' },
          { id: 'moov', label: 'Moov', type: 'text' }
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
            Soumettre
          </Button>
        </Col>
      </Row>
    </Form>
    </div>
   
  );
};

export default InfoBankForm;
