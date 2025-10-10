"use client";

import { useState } from "react";
import { Button, Modal, Input, Card, Badge } from "../../../../../../../../../components/ui";
import {
  Plus,
  X,
  GripVertical,
  Edit,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle
} from "lucide-react";

export default function StageConfigModal({ isOpen, onClose, onSave }) {
  const [stages, setStages] = useState([
    {
      id: 1,
      name: "Qualification",
      description: "Initial contact and qualification",
      probability: 25,
      color: "#6b7280",
      order: 1,
      isDefault: true
    },
    {
      id: 2,
      name: "Needs Analysis",
      description: "Understanding customer requirements",
      probability: 40,
      color: "#3b82f6",
      order: 2,
      isDefault: true
    },
    {
      id: 3,
      name: "Proposal",
      description: "Presenting solution and pricing",
      probability: 60,
      color: "#f59e0b",
      order: 3,
      isDefault: true
    },
    {
      id: 4,
      name: "Negotiation",
      description: "Finalizing terms and conditions",
      probability: 80,
      color: "#8b5cf6",
      order: 4,
      isDefault: true
    },
    {
      id: 5,
      name: "Closed Won",
      description: "Deal successfully closed",
      probability: 100,
      color: "#10b981",
      order: 5,
      isDefault: true
    },
    {
      id: 6,
      name: "Closed Lost",
      description: "Deal lost to competitor or other reasons",
      probability: 0,
      color: "#ef4444",
      order: 6,
      isDefault: true
    }
  ]);

  const [editingStage, setEditingStage] = useState(null);
  const [newStage, setNewStage] = useState({
    name: "",
    description: "",
    probability: 50,
    color: "#6b7280"
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const colorOptions = [
    { value: "#6b7280", label: "Gray", bg: "bg-gray-500" },
    { value: "#3b82f6", label: "Blue", bg: "bg-blue-500" },
    { value: "#10b981", label: "Green", bg: "bg-green-500" },
    { value: "#f59e0b", label: "Yellow", bg: "bg-yellow-500" },
    { value: "#8b5cf6", label: "Purple", bg: "bg-purple-500" },
    { value: "#ef4444", label: "Red", bg: "bg-red-500" },
    { value: "#f97316", label: "Orange", bg: "bg-orange-500" },
    { value: "#06b6d4", label: "Cyan", bg: "bg-cyan-500" }
  ];

  const handleAddStage = () => {
    if (newStage.name.trim()) {
      const stage = {
        id: Date.now(),
        name: newStage.name,
        description: newStage.description,
        probability: newStage.probability,
        color: newStage.color,
        order: stages.length + 1,
        isDefault: false
      };
      
      setStages([...stages, stage]);
      setNewStage({
        name: "",
        description: "",
        probability: 50,
        color: "#6b7280"
      });
      setShowAddForm(false);
    }
  };

  const handleEditStage = (stage) => {
    setEditingStage(stage);
  };

  const handleUpdateStage = (updatedStage) => {
    setStages(stages.map(stage => 
      stage.id === updatedStage.id ? updatedStage : stage
    ));
    setEditingStage(null);
  };

  const handleDeleteStage = (stageId) => {
    const stage = stages.find(s => s.id === stageId);
    if (stage && stage.isDefault) {
      alert("Cannot delete default stages");
      return;
    }
    
    setStages(stages.filter(stage => stage.id !== stageId));
  };

  const handleMoveStage = (stageId, direction) => {
    const currentIndex = stages.findIndex(s => s.id === stageId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex >= 0 && newIndex < stages.length) {
      const newStages = [...stages];
      [newStages[currentIndex], newStages[newIndex]] = [newStages[newIndex], newStages[currentIndex]];
      
      // Update order values
      newStages.forEach((stage, index) => {
        stage.order = index + 1;
      });
      
      setStages(newStages);
    }
  };

  const handleSave = () => {
    onSave(stages);
    onClose();
  };

  const validateStages = () => {
    const errors = [];
    
    // Check for duplicate names
    const names = stages.map(s => s.name.toLowerCase());
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
    if (duplicates.length > 0) {
      errors.push("Stage names must be unique");
    }
    
    // Check for empty names
    const emptyNames = stages.filter(s => !s.name.trim());
    if (emptyNames.length > 0) {
      errors.push("All stages must have a name");
    }
    
    // Check probability values
    const invalidProbabilities = stages.filter(s => s.probability < 0 || s.probability > 100);
    if (invalidProbabilities.length > 0) {
      errors.push("Probabilities must be between 0 and 100");
    }
    
    return errors;
  };

  const errors = validateStages();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-brand-foreground">Pipeline Stage Configuration</h2>
            <p className="text-sm text-brand-text-light">
              Configure your sales pipeline stages and their properties
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <h4 className="font-medium text-red-800">Please fix the following errors:</h4>
            </div>
            <ul className="text-sm text-red-700 list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Stages List */}
        <div className="space-y-4 mb-6">
          {stages.map((stage, index) => (
            <Card key={stage.id} className="p-4">
              <div className="flex items-center gap-4">
                {/* Drag Handle */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleMoveStage(stage.id, 'up')}
                    disabled={index === 0}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Stage Color */}
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: stage.color }}
                />

                {/* Stage Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-brand-foreground">{stage.name}</h3>
                    {stage.isDefault && (
                      <Badge variant="outline" className="text-xs">Default</Badge>
                    )}
                  </div>
                  <p className="text-sm text-brand-text-light">{stage.description}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-brand-text-light">
                      Probability: {stage.probability}%
                    </span>
                    <span className="text-xs text-brand-text-light">
                      Order: {stage.order}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditStage(stage)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  {!stage.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteStage(stage.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Add New Stage */}
        {showAddForm ? (
          <Card className="p-4 mb-6">
            <h3 className="font-semibold text-brand-foreground mb-4">Add New Stage</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-foreground mb-2">
                    Stage Name *
                  </label>
                  <Input
                    value={newStage.name}
                    onChange={(e) => setNewStage(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter stage name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-foreground mb-2">
                    Probability (%)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={newStage.probability}
                    onChange={(e) => setNewStage(prev => ({ ...prev, probability: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-2">
                  Description
                </label>
                <Input
                  value={newStage.description}
                  onChange={(e) => setNewStage(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter stage description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-2">
                  Color
                </label>
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setNewStage(prev => ({ ...prev, color: color.value }))}
                      className={`w-8 h-8 rounded-full ${color.bg} ${
                        newStage.color === color.value ? 'ring-2 ring-offset-2 ring-brand-primary' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={handleAddStage}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Add Stage
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="mb-6">
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Stage
            </Button>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-brand-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={errors.length > 0}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </div>
    </Modal>
  );
}
