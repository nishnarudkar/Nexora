"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

const STEPS = [
  "Country Profile",
  "Infrastructure",
  "Human Resources",
  "Funding",
  "Stakeholders"
];

export default function AssessmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: 'Kenya',
    population: 54000000,
    gdp: 113.4,
    energy_demand: 12.5,
    region: 'East Africa',
    carbon_goals: 'Net Zero by 2050',
    
    nuclear_policy: 'Drafting phase',
    regulatory_framework: 'None',
    existing_reactors: 0,
    educational_institutions: 'University of Nairobi',
    safety_mechanisms: 'Basic radiation board',
    energy_grid: 'Developing, max 300MW capacity per node',

    hr_nuclear_engineers: 5,
    hr_safety_experts: 2,
    hr_policy_experts: 3,
    hr_researchers: 10,
    hr_technical_staff: 20,

    budget: 500,
    gov_support: 'High',
    private_investment_capability: 'Low',
    economic_status: 'Developing',

    stakeholders: 'Ministry of Energy, KNEB, EPRA'
  });

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      submitAssessment();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const submitAssessment = async () => {
    setIsSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const countryRes = await fetch(`${apiUrl}/api/countries/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          population: formData.population,
          gdp: formData.gdp,
          energy_demand: formData.energy_demand,
          region: formData.region,
          carbon_goals: formData.carbon_goals,
          current_energy_mix: { geothermal: 47, hydro: 30, wind: 11, thermal: 10, solar: 2 }
        })
      });
      
      let countryId;
      if (countryRes.ok) {
        const cData = await countryRes.json();
        countryId = cData.id;
      } else {
        // If exists or error, we might need a workaround for prototype.
        // For now, assuming fresh DB each time or ignoring error for demo.
        countryId = 1; 
      }

      // 2. Create Assessment
      const assessmentRes = await fetch(`${apiUrl}/api/assessments/${countryId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nuclear_policy: formData.nuclear_policy,
          regulatory_framework: formData.regulatory_framework,
          existing_reactors: formData.existing_reactors,
          educational_institutions: formData.educational_institutions,
          safety_mechanisms: formData.safety_mechanisms,
          energy_grid: formData.energy_grid,
          hr_nuclear_engineers: formData.hr_nuclear_engineers,
          hr_safety_experts: formData.hr_safety_experts,
          hr_policy_experts: formData.hr_policy_experts,
          hr_researchers: formData.hr_researchers,
          hr_technical_staff: formData.hr_technical_staff,
          budget: formData.budget,
          gov_support: formData.gov_support,
          private_investment_capability: formData.private_investment_capability,
          economic_status: formData.economic_status,
          stakeholders: formData.stakeholders.split(',').map(s => s.trim())
        })
      });

      if (assessmentRes.ok) {
        const aData = await assessmentRes.json();
        // 3. Navigate to Report
        router.push(`/report?assessmentId=${aData.id}`);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 flex flex-col items-center relative">
      <div className="w-full max-w-3xl z-10">
        
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-4">
            {STEPS.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${idx <= currentStep ? 'bg-blue-600 text-white shadow-[0_0_20px_-5px_rgba(37,99,235,1)]' : 'bg-slate-800 text-slate-500'}`}>
                  {idx < currentStep ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>
                <span className={`text-xs font-medium hidden md:block ${idx <= currentStep ? 'text-blue-300' : 'text-slate-500'}`}>{step}</span>
              </div>
            ))}
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500 ease-in-out"
              style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Container */}
        <div className="glass-card mb-8 min-h-[400px]">
          <h2 className="text-3xl font-bold mb-6 text-white">{STEPS[currentStep]}</h2>
          
          <div className="space-y-6">
            {currentStep === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Country Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Population</label>
                  <input type="number" name="population" value={formData.population} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">GDP (Billion USD)</label>
                  <input type="number" name="gdp" value={formData.gdp} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Region</label>
                  <input type="text" name="region" value={formData.region} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Nuclear Policy Status</label>
                  <input type="text" name="nuclear_policy" value={formData.nuclear_policy} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Regulatory Framework</label>
                  <input type="text" name="regulatory_framework" value={formData.regulatory_framework} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Existing Reactors</label>
                  <input type="number" name="existing_reactors" value={formData.existing_reactors} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Energy Grid Capability</label>
                  <input type="text" name="energy_grid" value={formData.energy_grid} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Nuclear Engineers</label>
                  <input type="number" name="hr_nuclear_engineers" value={formData.hr_nuclear_engineers} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Safety Experts</label>
                  <input type="number" name="hr_safety_experts" value={formData.hr_safety_experts} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Policy Experts</label>
                  <input type="number" name="hr_policy_experts" value={formData.hr_policy_experts} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Technical Staff</label>
                  <input type="number" name="hr_technical_staff" value={formData.hr_technical_staff} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Initial Budget (Million USD)</label>
                  <input type="number" name="budget" value={formData.budget} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Government Support</label>
                  <select name="gov_support" value={formData.gov_support} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all">
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Private Investment</label>
                  <select name="private_investment_capability" value={formData.private_investment_capability} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all">
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Key Stakeholders (Comma separated)</label>
                  <textarea name="stakeholders" value={formData.stakeholders} onChange={handleChange as any} rows={4} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none" />
                </div>
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <p className="text-sm text-blue-200">
                    By submitting this assessment, our AI engine will cross-reference your inputs with IAEA standards, benchmark against similar nations, and generate a comprehensive Nuclear Readiness Index and phased SMR deployment roadmap.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button 
            onClick={handlePrev}
            disabled={currentStep === 0 || isSubmitting}
            className={`px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          
          <button 
            onClick={handleNext}
            disabled={isSubmitting}
            className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-2 shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] transition-all"
          >
            {isSubmitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>
            ) : currentStep === STEPS.length - 1 ? (
              <>Generate AI Report <CheckCircle2 className="w-5 h-5" /></>
            ) : (
              <>Next Step <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
