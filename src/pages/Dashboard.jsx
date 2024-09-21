import React, { useEffect } from 'react';
import Search from '../components/Search';
import { t } from 'i18next';
import Orders from './Orders';

function Dashboard() {
  return (
    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-12">
        <Orders />
      </div>
    </div>
  );
}

export default Dashboard;
