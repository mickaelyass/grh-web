import { Button } from '../../../ui/Button'
import { Card, CardBody } from '../../../ui/Card'
import { Form, FormFeedback, FormInput, FormLabel, FormSelect, FormTextarea } from '../../../ui/Form'
import React ,{useEffect,useState}from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { getDoc } from '../../../services/api';

const CongeForm = ({ onSubmit }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const matricule = user ? user.matricule : '';
    const [dossier, setDossier] = useState(null);
    const [loading, setLoading] = useState(true);

      useEffect(() => {
        if (matricule) {
          console.log(matricule);
          fetchDossier();
          console.log(dossier);
        }
      }, [matricule]);
  
      useEffect(() => {
        console.log("Dossier mis à jour:", dossier);
      }, [dossier]); // Affiche la nouvelle valeur de dossier après mise à jour
  
        const fetchDossier = async () => {
          try {
            const response = await getDoc(matricule);
            console.log(response.data);
            setDossier(response.data);
            console.log(dossier);
          } catch (error) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
        };

  const calculateEndDate = (startDate, numberOfDays) => {
    if (!startDate || !numberOfDays) return '';
    const start = new Date(startDate);
    start.setDate(start.getDate() + Number(numberOfDays));
    return start.toISOString().split('T')[0];
  };

  const formik = useFormik({
    initialValues: {
      matricule: matricule,
      type_conge: '',
      date_debut: '',
      annee_jouissance: '0000',
      nombre_de_jour: '',
      date_de_fin: '',
      raison: 'Facultatif',
      piece_jointe_1: null,
      piece_jointe_2: null,
    },
    validationSchema: Yup.lazy((values) => {
      const commonValidation = {
        matricule: Yup.string().required('Matricule est requis'),
        type_conge: Yup.string().required('Type de congé est requis'),
        date_debut: Yup.date().required('Date de début est requise'),
        nombre_de_jour: Yup.number().required('Nombre de jours est requis'),
      };

      if (values.type_conge === 'Congé administratif') {
        return Yup.object({
          ...commonValidation,
          annee_jouissance: Yup.number().required("Année de jouissance est requise"),
          piece_jointe_1: Yup.mixed().required('La première pièce jointe est requise'),
          piece_jointe_2: Yup.mixed().required('La deuxième pièce jointe est requise'),
        });
      } else if (values.type_conge === 'Congé maternité') {
        return Yup.object({
          ...commonValidation,
          piece_jointe_1: Yup.mixed().required('Certificat de grossesse requis'),
        });
      } else if (values.type_conge === 'Congé maladie') {
        return Yup.object({
          ...commonValidation,
          piece_jointe_1: Yup.mixed().required('Certificat médical requis'),
        });
      } else {
        return Yup.object(commonValidation);
      }
    }),
    onSubmit: (values) => {
      console.log(values);
      onSubmit(values);
    },
  });

  const handleDateChange = (field, value) => {
    formik.setFieldValue(field, value);

    if (field === 'date_debut' || field === 'nombre_de_jour') {
      const endDate = calculateEndDate(
        field === 'date_debut' ? value : formik.values.date_debut,
        field === 'nombre_de_jour' ? value : formik.values.nombre_de_jour
      );
      formik.setFieldValue('date_de_fin', endDate);
    }
  };

  const isFieldVisible = (field) => {
    if (formik.values.type_conge === 'Congé administratif') {
      return true;
    } else if (formik.values.type_conge === 'Congé maternité' && field === 'piece_jointe_1') {
      return true;
    } else if (formik.values.type_conge === 'Congé maladie' && field === 'piece_jointe_1') {
      return true;
    }
    return false;
  };

  return (
    <Card className="shadow-sm">
      <CardBody>
        <Form onSubmit={formik.handleSubmit} className="p-4">
          <input id="matricule" name="matricule" type="hidden" value={formik.values.matricule} />

          <div className="mb-3">
            <FormLabel htmlFor="type_conge">Type de Congé</FormLabel>
            <FormSelect
              id="type_conge"
              name="type_conge"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.type_conge}
              invalid={formik.touched.type_conge && !!formik.errors.type_conge}
            >
              <option value="">-- Sélectionnez le type de congé --</option>
              <option value="Congé administratif">Congé administratif</option>
              <option value="Congé maladie">Congé maladie</option>
              {dossier?.InfoIdent.sexe=='F' && <option value="Congé maternité">Congé maternité</option>}
              <option value="Autres">Autres</option>
            </FormSelect>
            {formik.errors.type_conge && (
              <FormFeedback invalid>{formik.errors.type_conge}</FormFeedback>
            )}
          </div>

          <div className="mb-3">
            <FormLabel htmlFor="date_debut">Date de Début</FormLabel>
            <FormInput
              id="date_debut"
              name="date_debut"
              type="date"
              onChange={(e) => handleDateChange('date_debut', e.target.value)}
              value={formik.values.date_debut}
              invalid={formik.errors.date_debut}
            />
          </div>

          {formik.values.type_conge === 'Congé administratif' && (
            <div className="mb-3">
              <FormLabel htmlFor="annee_jouissance">Année de Jouissance</FormLabel>
              <FormSelect
                id="annee_jouissance"
                name="annee_jouissance"
                onChange={formik.handleChange}
                value={formik.values.annee_jouissance}
              >
                <option value="">-- Sélectionnez une année --</option>
                {Array.from({ length: 31 }, (_, i) => 2010 + i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </FormSelect>
            </div>
          )}

          <div className="mb-3">
            <FormLabel htmlFor="nombre_de_jour">Nombre de jours</FormLabel>
            <FormInput
              id="nombre_de_jour"
              name="nombre_de_jour"
              type="number"
              onChange={(e) => handleDateChange('nombre_de_jour', e.target.value)}
              value={formik.values.nombre_de_jour}
            />
          </div>

          {['piece_jointe_1', 'piece_jointe_2'].map(
            (field) =>
              isFieldVisible(field) && (
                <div className="mb-3" key={field}>
                  <FormLabel htmlFor={field}>
                    {field === 'piece_jointe_1' && formik.values.type_conge === 'Congé maternité'
                      ? 'Certificat de grossesse'
                      : field === 'piece_jointe_1' && formik.values.type_conge === 'Congé maladie'
                      ? 'Certificat médical'
                      : field === 'piece_jointe_1'
                      ? 'Première pièce jointe'
                      : 'Deuxième pièce jointe'}
                  </FormLabel>
                  <FormInput
                    id={field}
                    name={field}
                    type="file"
                    onChange={(event) => {
                      formik.setFieldValue(field, event.currentTarget.files[0]);
                    }}
                  />
                </div>
              )
          )}
           <div className="mb-3">
            <FormLabel htmlFor="date_de_fin">Date de Fin</FormLabel>
            <FormInput
              id="date_de_fin"
              name="date_de_fin"
              type="date"
              value={formik.values.date_de_fin}
              readOnly
            />
          </div>

          <Button type="submit" color="primary" className="w-100">
            Soumettre
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default CongeForm;
