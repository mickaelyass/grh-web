import { Alert } from '../../../ui/Alert'
import { Button } from '../../../ui/Button'
import { Card, CardHeader } from '../../../ui/Card'
import { Form, FormInput, FormLabel, FormTextarea } from '../../../ui/Form'
import { Col, Row } from '../../../ui/Grid'
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';

import DistinctionForm from './DistinctionForm';
import SanctionForm from './SanctionForm';

const InfoComplementaireForm = ({ onSubmite, updateData, initial, setCanProceed }) => {
  const [distinction, setDistinction] = useState(null);
  const [sanction, setSanction] = useState(null);

  const [showDistinctionForm, setShowDistinctionForm] = useState(false);
  const [showSanctionForm, setShowSanctionForm] = useState(false);
  const [message, setMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      observation_particuliere: initial?.observation_particuliere || '',
      situat_sante: initial?.situat_sante || '',
    },
    validationSchema: Yup.object({
      observation_particuliere: Yup.string(),
      situat_sante: Yup.string().required('La situation de santé est requise'),
    }),
    onSubmit: (values) => {
      const dataToSubmit = {
        infoComplementaire: values || {},
        distinction: distinction || {},
        sanction: sanction || {}
      };

      updateData(dataToSubmit);
      setCanProceed?.(true); // Appelle setCanProceed si fourni
      onSubmite(); // Étape suivante
    },
  });
useEffect(() => {
  if (message) {
    const timer = setTimeout(() => setMessage(''), 3000);
    return () => clearTimeout(timer);
  }
}, [message]);
  return (
    <Card className="p-4">
      <CardHeader className="mb-3">
        <strong>Information Complémentaire</strong>
      </CardHeader>

      <div className="my-3">
        {/* Boutons pour sous-formulaires */}
        <Button
          color="secondary"
          className="me-2"
          onClick={() => setShowSanctionForm(!showSanctionForm)}
        >
          {showSanctionForm ? 'Masquer Sanction' : 'Ajouter Sanction'}
        </Button>
       {/*  {sanction && <small className="text-success">✔ Sanction enregistrée</small>} */}

        {showSanctionForm && (
          <div className="border rounded p-3 my-2 bg-light">
            <SanctionForm info={initial?.Sanctions} handle={(data) => {
                    setSanction(data);
                    setShowSanctionForm(false); // Masquer automatiquement
                     setMessage('✔ Sanction enregistrée');
                  }} />
          </div>
        )}

        <Button
          color="secondary"
          className="me-2"
          onClick={() => setShowDistinctionForm(!showDistinctionForm)}
        >
          {showDistinctionForm ? 'Masquer Distinction' : 'Ajouter Distinction'}
        </Button>
       {/*  {distinction && <small className="text-success">✔ Distinction enregistrée</small>} */}

        {showDistinctionForm && (
          <div className="border rounded p-3 my-2 bg-light">
            <DistinctionForm info={initial?.Distinctions} handle={(data) => {
                setDistinction(data);
                setShowDistinctionForm(false); // Masquer automatiquement
                  setMessage('✔ Distinction enregistrée');
              }} />
          </div>
        )}
      </div>
            {message && (
        <Alert color="success">
          {message}
        </Alert>
      )}
      <Form onSubmit={formik.handleSubmit}>
        <Row>
          <Col xs={12} md={6} className="mb-3">
            <FormLabel htmlFor="observation_particuliere">Observation particulière</FormLabel>
            <FormTextarea
              id="observation_particuliere"
              name="observation_particuliere"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.observation_particuliere}
              invalid={formik.touched.observation_particuliere && !!formik.errors.observation_particuliere}
            />
            {formik.touched.observation_particuliere && formik.errors.observation_particuliere && (
              <Alert color="danger">{formik.errors.observation_particuliere}</Alert>
            )}
          </Col>

          <Col xs={12} md={6} className="mb-3">
            <FormLabel htmlFor="situat_sante">Situation de santé</FormLabel>
            <FormInput
              id="situat_sante"
              name="situat_sante"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.situat_sante}
              invalid={formik.touched.situat_sante && !!formik.errors.situat_sante}
            />
            {formik.touched.situat_sante && formik.errors.situat_sante && (
              <Alert color="danger">{formik.errors.situat_sante}</Alert>
            )}
          </Col>

          <Col xs={12} className="mt-3">
            <Button
              type="submit"
              color="primary"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              Soumettre
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default InfoComplementaireForm;
