import React from 'react';
import { BarChartIcon, PhoneIcon, ServerIcon } from '../components/icons/Icons';

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <Icon className="h-6 w-6 text-teal-400" />
        </div>
        <p className="mt-2 text-3xl font-bold text-white">{value}</p>
    </div>
);

export const DashboardPage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="mt-2 text-gray-400">Bienvenido a VoiceWoot. Aquí tienes un resumen de tu plataforma.</p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Llamadas Activas" value="3" icon={PhoneIcon} />
                <StatCard title="Troncales Registradas" value="1 / 2" icon={ServerIcon} />
                <StatCard title="Disponibilidad del Agente" value="98.7%" icon={BarChartIcon} />
            </div>

            <div className="mt-8 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h2 className="text-xl font-bold text-teal-400">Próximamente...</h2>
                <p className="text-gray-400 mt-2">Gráficas en tiempo real de latencia, DIDs por país y rendimiento de los agentes de n8n.</p>
            </div>
        </div>
    );
};
