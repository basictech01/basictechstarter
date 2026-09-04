'use client';

import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

const districtsData: {
  [key: string]: {
    en: string;
    hi: string;
    population: number;
    area: number;
    literacy: number;
    alerts: number;
    description: string;
  };
} = {
  uttarkashi: {
    en: 'Uttarkashi',
    hi: 'उत्तरकाशी',
    population: 365638,
    area: 8016,
    literacy: 75.6,
    alerts: 2,
    description: 'Uttarkashi is located in the Garhwal region of Uttarakhand in northern India.',
  },
  chamoli: {
    en: 'Chamoli',
    hi: 'चमोली',
    population: 390235,
    area: 8030,
    literacy: 70.8,
    alerts: 3,
    description: 'Chamoli is a district in the state of Uttarakhand, located in the Garhwal region.',
  },
  rudraprayag: {
    en: 'Rudraprayag',
    hi: 'रुद्रप्रयाग',
    population: 244374,
    area: 2430,
    literacy: 79.2,
    alerts: 1,
    description: 'Rudraprayag is a district in Uttarakhand, known for its religious significance.',
  },
  'pauri-garhwal': {
    en: 'Pauri Garhwal',
    hi: 'पौड़ी गढ़वाल',
    population: 688748,
    area: 5230,
    literacy: 72.9,
    alerts: 0,
    description: 'Pauri Garhwal is the largest district by population in Garhwal region.',
  },
  'tehri-garhwal': {
    en: 'Tehri Garhwal',
    hi: 'टेहरी गढ़वाल',
    population: 647469,
    area: 3642,
    literacy: 75.3,
    alerts: 1,
    description: 'Tehri Garhwal is home to the Tehri Dam, one of the tallest dams in India.',
  },
  dehradun: {
    en: 'Dehradun',
    hi: 'देहरादून',
    population: 1703168,
    area: 3079,
    literacy: 83.8,
    alerts: 0,
    description: 'Dehradun is the capital city of Uttarakhand and the largest city in the state.',
  },
  almora: {
    en: 'Almora',
    hi: 'अल्मोड़ा',
    population: 572606,
    area: 3138,
    literacy: 71.9,
    alerts: 0,
    description: 'Almora is a district in the Kumaon region known for its scenic beauty.',
  },
  bageshwar: {
    en: 'Bageshwar',
    hi: 'बागेश्वर',
    population: 267537,
    area: 2144,
    literacy: 69.4,
    alerts: 0,
    description: 'Bageshwar is a small district in the Kumaon region of Uttarakhand.',
  },
  nainital: {
    en: 'Nainital',
    hi: 'नैनीताल',
    population: 902158,
    area: 2793,
    literacy: 80.2,
    alerts: 2,
    description: 'Nainital is known for the famous Naini Lake and is a major tourist destination.',
  },
  pithoragarh: {
    en: 'Pithoragarh',
    hi: 'पिथौरागढ़',
    population: 483439,
    area: 3591,
    literacy: 68.5,
    alerts: 0,
    description: 'Pithoragarh is a district in the Kumaon region near the Indo-Nepal border.',
  },
  champawat: {
    en: 'Champawat',
    hi: 'चम्पावत',
    population: 261648,
    area: 1613,
    literacy: 72.3,
    alerts: 1,
    description: 'Champawat is the smallest district of Uttarakhand by area.',
  },
};

export default function DistrictDetailPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params?.slug as string;

  const district = slug ? districtsData[slug] : null;

  if (!district) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-light to-white p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-6 text-primary-accent hover:underline"
          >
            ← Back
          </button>
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-semibold">District not found</p>
            <p className="text-sm mt-2">The district you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-light to-white">
      {/* Header */}
      <div className="bg-dark-rail text-text-light py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-4 text-text-light/80 hover:text-text-light text-sm"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold font-display">{district.en}</h1>
          <p className="text-text-light/70 mt-2 font-display">{district.hi}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-primary-accent">
            <div className="text-sm text-gray-600 mb-1">Population</div>
            <div className="text-2xl font-bold text-text-dark">
              {(district.population / 100000).toFixed(1)}L
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-primary-accent">
            <div className="text-sm text-gray-600 mb-1">Area (km²)</div>
            <div className="text-2xl font-bold text-text-dark">
              {district.area.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-primary-accent">
            <div className="text-sm text-gray-600 mb-1">Literacy Rate</div>
            <div className="text-2xl font-bold text-text-dark">{district.literacy}%</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-alert-critical">
            <div className="text-sm text-gray-600 mb-1">Active Alerts</div>
            <div className="text-2xl font-bold text-alert-critical">{district.alerts}</div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold font-display mb-3">About {district.en}</h2>
          <p className="text-gray-700 leading-relaxed">{district.description}</p>
        </div>

        {/* Detailed Information */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold font-display mb-4">Demographics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Population</span>
                <span className="font-semibold">{district.population.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Area</span>
                <span className="font-semibold">{district.area} km²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Population Density</span>
                <span className="font-semibold">{Math.round(district.population / district.area)}/km²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Literacy Rate</span>
                <span className="font-semibold">{district.literacy}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold font-display mb-4">Current Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Alerts</span>
                <span className={`font-semibold px-3 py-1 rounded ${
                  district.alerts > 0
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {district.alerts} {district.alerts === 1 ? 'alert' : 'alerts'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Data Status</span>
                <span className="font-semibold text-green-600">Live</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-semibold text-sm">2026-09-04 16:00 UTC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>Data sourced from government databases and real-time feeds</p>
        </div>
      </div>
    </div>
  );
}
