import React, { useState } from 'react';
import { Instrument } from '../types';
import { Settings, Plus, Trash2 } from 'lucide-react';

interface InstrumentSelectorProps {
  instruments: Instrument[];
  selectedId: string;
  onSelect: (id: string) => void;
  onUpdateInstruments: (instruments: Instrument[]) => void;
}

export const InstrumentSelector: React.FC<InstrumentSelectorProps> = ({
  instruments,
  selectedId,
  onSelect,
  onUpdateInstruments,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newInstrumentName, setNewInstrumentName] = useState('');
  const [newLotSize, setNewLotSize] = useState('');

  const handleAdd = () => {
    if (!newInstrumentName || !newLotSize) return;
    const newInst: Instrument = {
      id: Date.now().toString(),
      name: newInstrumentName,
      lotSize: parseFloat(newLotSize),
    };
    onUpdateInstruments([...instruments, newInst]);
    setNewInstrumentName('');
    setNewLotSize('');
  };

  const handleDelete = (id: string) => {
    if (instruments.length <= 1) return; // Prevent deleting last one
    const updated = instruments.filter(i => i.id !== id);
    onUpdateInstruments(updated);
    if (selectedId === id) {
      onSelect(updated[0].id);
    }
  };

  return (
    <div className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-indigo-400">Instrument Configuration</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          <Settings size={20} />
        </button>
      </div>

      {!isEditing ? (
        <div className="flex flex-wrap gap-2">
          {instruments.map((inst) => (
            <button
              key={inst.id}
              onClick={() => onSelect(inst.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedId === inst.id
                  ? 'bg-indigo-600 text-white shadow-indigo-500/30 shadow-lg'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {inst.name}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="space-y-2">
            {instruments.map((inst) => (
              <div key={inst.id} className="flex items-center justify-between bg-slate-750 p-2 rounded bg-slate-900/50">
                <div className="flex items-center gap-4">
                  <span className="font-medium">{inst.name}</span>
                  <span className="text-xs text-slate-400">Lot Size: {inst.lotSize}</span>
                </div>
                {instruments.length > 1 && (
                  <button onClick={() => handleDelete(inst.id)} className="text-red-400 hover:text-red-300">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-700 flex flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder="Name (e.g. Gold)"
              value={newInstrumentName}
              onChange={(e) => setNewInstrumentName(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 flex-1"
            />
            <input
              type="number"
              placeholder="Lot Size (e.g. 10)"
              value={newLotSize}
              onChange={(e) => setNewLotSize(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 w-32"
            />
            <button
              onClick={handleAdd}
              className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Plus size={16} /> Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
