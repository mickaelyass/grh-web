import React, { useEffect, useState } from "react";
import { getDossiers } from "../../services/api";
import { FaUser, FaFemale, FaUsers, FaMale, FaUserShield, FaHandshake, FaGlobeAfrica } from 'react-icons/fa';

const Statistique = () => {
  const [employees, setEmployees] = useState([]);
  const [homme, setHomme] = useState([]);
  const [femme, setFemme] = useState([]);
  const [acdpe, setAcdpe] = useState([]);
  const [fe, setFe] = useState([]);
  const [afc, setAfc] = useState([]);

  const fetchDossiers = async () => {
    try {
      const response = await getDossiers();
      setEmployees(response.data);
      const h = response.data.filter(employee => employee.InfoIdent?.sexe === 'M');
      const f = response.data.filter(employee => employee.InfoIdent?.sexe === 'F');
      const ac = response.data.filter(employee => employee.InfoPro?.statut === 'ACDPE');
      const fe = response.data.filter(employee => employee.InfoPro?.statut === 'FE');
      const afc = response.data.filter(employee => employee.InfoPro?.statut === 'AFC');
      setHomme(h);
      setFemme(f);
      setAcdpe(ac);
      setFe(fe);
      setAfc(afc);
    } catch (error) {
      console.error('Error fetching dossiers', error);
    }
  };

  useEffect(() => {
    fetchDossiers();
  }, []);

  const stats = [
    {
      label: "Hommes",
      value: homme.length,
      icon: <FaMale size={30} color="#0d6efd" />,
      bg: "primary",
    },
    {
      label: "Femmes",
      value: femme.length,
      icon: <FaFemale size={30} color="#d63384" />,
      bg: "danger",
    },
    {
      label: "Fonctionnaires d'État",
      value: fe.length,
      icon: <FaUserShield size={30} color="#20c997" />,
      bg: "success",
    },
    {
      label: "ACDPE",
      value: acdpe.length,
      icon: <FaHandshake size={30} color="#fd7e14" />,
      bg: "warning",
    },
    {
      label: "AFC",
      value: afc.length,
      icon: <FaGlobeAfrica size={30} color="#6610f2" />,
      bg: "info",
    },
    {
      label: "Total agents",
      value: employees.length,
      icon: <FaUsers size={30} color="#198754" />,
      bg: "dark",
    },
  ];

  return (
    <div className="container-fluid px-3 py-3">
      <div className="row">
        {stats.map((item, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className={`card border-start border-${item.bg} shadow-sm`}>
              <div className="card-body d-flex align-items-center">
                <div className="me-3">{item.icon}</div>
                <div>
                  <h6 className="mb-0 text-muted">{item.label}</h6>
                  <h5 className="mb-0 text-${item.bg}">{item.value}</h5>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Statistique;
