import React from 'react';

import { ImageConnection } from '~/contentstack/types';
import { ContentstackImageComponent } from '~/contentstack/utils';

interface Employee {
  imageConnection?: ImageConnection;
  name: string;
  designation: string;
}

interface TeamProps {
  title_h2: string;
  description: string;
  employees: [Employee];
}

export default function TeamSection({ ourTeam }: { ourTeam: TeamProps }) {
  return (
    <div className="about-team-section">
      <div className="team-head-section">
        <h2>{ourTeam.title_h2}</h2>
        <p>{ourTeam.description}</p>
      </div>
      <div className="team-content">
        {ourTeam.employees.map((employee, index) => (
          <div className="team-details" key={index}>
            {employee.imageConnection && (
              <ContentstackImageComponent imageConnection={employee.imageConnection} />
            )}
            <div className="team-details">
              <h3>{employee.name}</h3>
              <p>{employee.designation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
