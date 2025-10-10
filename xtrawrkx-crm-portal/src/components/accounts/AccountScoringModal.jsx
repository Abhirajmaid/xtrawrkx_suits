"use client";

import { useState } from "react";
import { Modal } from "@xtrawrkx/ui";
import { Target, Plus, Trash2, Save, RotateCcw, Info } from "lucide-react";

export default function AccountScoringModal({ isOpen, onClose, onSaveRules }) {
  const [scoringRules, setScoringRules] = useState([
    {
      id: 1,
      name: "Company Size",
      criteria: "employees",
      condition: "greater_than",
      value: "500",
      points: 20,
      active: true,
    },
    {
      id: 2,
      name: "Annual Revenue",
      criteria: "revenue",
      condition: "greater_than",
      value: "1000000",
      points: 25,
      active: true,
    },
    {
      id: 3,
      name: "Industry Match",
      criteria: "industry",
      condition: "equals",
      value: "Technology",
      points: 15,
      active: true,
    },
    {
      id: 4,
      name: "Website Present",
      criteria: "website",
      condition: "not_empty",
      value: "",
      points: 10,
      active: true,
    },
  ]);

  const [newRule, setNewRule] = useState({
    name: "",
    criteria: "revenue",
    condition: "greater_than",
    value: "",
    points: 10,
    active: true,
  });

  const criteriaOptions = [
    { value: "revenue", label: "Annual Revenue" },
    { value: "employees", label: "Company Size" },
    { value: "industry", label: "Industry" },
    { value: "type", label: "Account Type" },
    { value: "website", label: "Website" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "deals", label: "Number of Deals" },
    { value: "contacts", label: "Number of Contacts" },
    { value: "lastActivity", label: "Last Activity" },
  ];

  const conditionOptions = {
    revenue: [
      { value: "greater_than", label: "Greater than" },
      { value: "less_than", label: "Less than" },
      { value: "equals", label: "Equals" },
      { value: "between", label: "Between" },
    ],
    employees: [
      { value: "greater_than", label: "Greater than" },
      { value: "less_than", label: "Less than" },
      { value: "equals", label: "Equals" },
    ],
    industry: [
      { value: "equals", label: "Equals" },
      { value: "not_equals", label: "Not equals" },
      { value: "contains", label: "Contains" },
    ],
    type: [
      { value: "equals", label: "Equals" },
      { value: "not_equals", label: "Not equals" },
    ],
    website: [
      { value: "not_empty", label: "Has website" },
      { value: "empty", label: "No website" },
      { value: "contains", label: "Contains" },
    ],
    email: [
      { value: "not_empty", label: "Has email" },
      { value: "empty", label: "No email" },
      { value: "contains", label: "Contains" },
    ],
    phone: [
      { value: "not_empty", label: "Has phone" },
      { value: "empty", label: "No phone" },
    ],
    deals: [
      { value: "greater_than", label: "Greater than" },
      { value: "less_than", label: "Less than" },
      { value: "equals", label: "Equals" },
    ],
    contacts: [
      { value: "greater_than", label: "Greater than" },
      { value: "less_than", label: "Less than" },
      { value: "equals", label: "Equals" },
    ],
    lastActivity: [
      { value: "within_days", label: "Within last X days" },
      { value: "older_than", label: "Older than X days" },
    ],
  };

  const addRule = () => {
    if (!newRule.name.trim()) return;
    
    const rule = {
      ...newRule,
      id: Date.now(),
    };
    
    setScoringRules(prev => [...prev, rule]);
    setNewRule({
      name: "",
      criteria: "revenue",
      condition: "greater_than",
      value: "",
      points: 10,
      active: true,
    });
  };

  const updateRule = (id, field, value) => {
    setScoringRules(prev =>
      prev.map(rule =>
        rule.id === id ? { ...rule, [field]: value } : rule
      )
    );
  };

  const deleteRule = (id) => {
    setScoringRules(prev => prev.filter(rule => rule.id !== id));
  };

  const toggleRule = (id) => {
    setScoringRules(prev =>
      prev.map(rule =>
        rule.id === id ? { ...rule, active: !rule.active } : rule
      )
    );
  };

  const resetToDefaults = () => {
    setScoringRules([
      {
        id: 1,
        name: "Company Size",
        criteria: "employees",
        condition: "greater_than",
        value: "500",
        points: 20,
        active: true,
      },
      {
        id: 2,
        name: "Annual Revenue",
        criteria: "revenue",
        condition: "greater_than",
        value: "1000000",
        points: 25,
        active: true,
      },
      {
        id: 3,
        name: "Industry Match",
        criteria: "industry",
        condition: "equals",
        value: "Technology",
        points: 15,
        active: true,
      },
      {
        id: 4,
        name: "Website Present",
        criteria: "website",
        condition: "not_empty",
        value: "",
        points: 10,
        active: true,
      },
    ]);
  };

  const handleSave = () => {
    onSaveRules(scoringRules);
    onClose();
  };

  const totalMaxScore = scoringRules
    .filter(rule => rule.active)
    .reduce((sum, rule) => sum + parseInt(rule.points), 0);

  const needsValue = (condition) => {
    return !['not_empty', 'empty'].includes(condition);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Account Scoring Rules"
      size="xl"
    >
      <div className="space-y-6">
        {/* Header Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">
                How Account Scoring Works
              </h4>
              <p className="text-sm text-blue-700">
                Create rules to automatically score accounts based on their attributes. 
                Higher scores indicate better prospects. Maximum possible score: <strong>{totalMaxScore} points</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Existing Rules */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Scoring Rules</h3>
            <button
              onClick={resetToDefaults}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </button>
          </div>

          <div className="space-y-3">
            {scoringRules.map((rule) => (
              <div
                key={rule.id}
                className={`border rounded-lg p-4 ${
                  rule.active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rule.active}
                      onChange={() => toggleRule(rule.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex-1 grid grid-cols-5 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Rule Name
                      </label>
                      <input
                        type="text"
                        value={rule.name}
                        onChange={(e) => updateRule(rule.id, 'name', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!rule.active}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Criteria
                      </label>
                      <select
                        value={rule.criteria}
                        onChange={(e) => updateRule(rule.id, 'criteria', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!rule.active}
                      >
                        {criteriaOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Condition
                      </label>
                      <select
                        value={rule.condition}
                        onChange={(e) => updateRule(rule.id, 'condition', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!rule.active}
                      >
                        {conditionOptions[rule.criteria]?.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Value
                      </label>
                      <input
                        type="text"
                        value={rule.value}
                        onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
                        placeholder={needsValue(rule.condition) ? "Enter value" : "N/A"}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!rule.active || !needsValue(rule.condition)}
                      />
                    </div>
                    
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Points
                        </label>
                        <input
                          type="number"
                          value={rule.points}
                          onChange={(e) => updateRule(rule.id, 'points', parseInt(e.target.value) || 0)}
                          min="0"
                          max="100"
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={!rule.active}
                        />
                      </div>
                      <button
                        onClick={() => deleteRule(rule.id)}
                        className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Rule */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="font-medium text-gray-900 mb-3">Add New Rule</h4>
          <div className="grid grid-cols-5 gap-3">
            <div>
              <input
                type="text"
                value={newRule.name}
                onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Rule name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <select
                value={newRule.criteria}
                onChange={(e) => setNewRule(prev => ({ ...prev, criteria: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {criteriaOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                value={newRule.condition}
                onChange={(e) => setNewRule(prev => ({ ...prev, condition: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {conditionOptions[newRule.criteria]?.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <input
                type="text"
                value={newRule.value}
                onChange={(e) => setNewRule(prev => ({ ...prev, value: e.target.value }))}
                placeholder={needsValue(newRule.condition) ? "Enter value" : "N/A"}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!needsValue(newRule.condition)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={newRule.points}
                onChange={(e) => setNewRule(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                min="0"
                max="100"
                placeholder="Points"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addRule}
                disabled={!newRule.name.trim()}
                className={`p-2 rounded-lg transition-colors ${
                  newRule.name.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Score Preview */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Scoring Summary</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Rules:</span>
              <span className="ml-2 font-medium">{scoringRules.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Active Rules:</span>
              <span className="ml-2 font-medium text-green-600">
                {scoringRules.filter(r => r.active).length}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Max Score:</span>
              <span className="ml-2 font-medium text-blue-600">{totalMaxScore} points</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Rules
          </button>
        </div>
      </div>
    </Modal>
  );
}
