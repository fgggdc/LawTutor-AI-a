import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { LAW_SUBJECTS } from '../data/lawData';

interface QuizResult {
  id: string;
  timestamp: number;
  score: number;
  total: number;
  subjectId: string;
}

interface Props {
  results: QuizResult[];
}

export const QuizDashboard: React.FC<Props> = ({ results }) => {
  if (results.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm text-center">
        <p className="text-stone-500">কোনো পূর্ববর্তী কুইজ রেকর্ড পাওয়া যায়নি। পরীক্ষা দিলে এখানে রিপোর্ট দেখা যাবে।</p>
      </div>
    );
  }

  // Process data for trend chart (over time)
  const trendData = results.map((r, i) => {
    const date = new Date(r.timestamp);
    const dateString = `${date.getDate()}/${date.getMonth()+1}`;
    return {
      name: `কুইজ ${i + 1}`,
      date: dateString,
      scorePercent: Math.round((r.score / r.total) * 100),
      rawScore: `${r.score}/${r.total}`
    };
  });

  // Process data for accuracy per subject
  const subjectStats: Record<string, { correct: number, total: number }> = {};
  
  results.forEach(r => {
    if (!subjectStats[r.subjectId]) {
      subjectStats[r.subjectId] = { correct: 0, total: 0 };
    }
    subjectStats[r.subjectId].correct += r.score;
    subjectStats[r.subjectId].total += r.total;
  });

  const subjectData = Object.keys(subjectStats).map(subjectId => {
    const stat = subjectStats[subjectId];
    const subjectName = subjectId === 'all' 
      ? 'সকল বিষয়' 
      : (LAW_SUBJECTS.find(s => s.id === subjectId)?.nameBn || subjectId);
      
    return {
      name: subjectName,
      accuracy: Math.round((stat.correct / stat.total) * 100),
    };
  });

  return (
    <div className="space-y-6">
      {/* Trend Chart */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-stone-900">পারফরম্যান্স ট্রেন্ড (স্কোর %)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} />
              <RechartsTooltip 
                animationDuration={0}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`${value}%`, 'সঠিক']}
                labelStyle={{ fontWeight: 'bold', color: '#1f2937' }}
              />
              <Line 
                isAnimationActive={false}
                type="monotone" 
                dataKey="scorePercent" 
                stroke="#d97706" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#d97706', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#d97706', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Accuracy per subject */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-stone-900">বিষয়ভিত্তিক সঠিক উত্তরের হার</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} />
              <RechartsTooltip 
                animationDuration={0}
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`${value}%`, 'সঠিক হার']}
                labelStyle={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}
              />
              <Bar isAnimationActive={false} dataKey="accuracy" radius={[6, 6, 0, 0]} fill="#d1d5db">
                {subjectData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.accuracy > 70 ? '#10b981' : entry.accuracy > 40 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
