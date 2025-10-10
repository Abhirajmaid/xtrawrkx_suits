"use client";

import { useState } from "react";
import { Card, Button, Select, Checkbox, Badge, Input } from "../../../../../../../../components/ui";
import {
  Users,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Globe,
  Shield,
  User,
  Building,
  Save,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";

export default function TeamVisibilitySettings() {
  const [selectedModule, setSelectedModule] = useState("leads");
  const [visibilityRules, setVisibilityRules] = useState({});
  const [showAddRule, setShowAddRule] = useState(false);

  const modules = [
    { value: "leads", label: "Leads" },
    { value: "contacts", label: "Contacts" },
    { value: "deals", label: "Deals" },
    { value: "accounts", label: "Accounts" },
    { value: "activities", label: "Activities" },
  ];

  const visibilityLevels = [
    { value: "owner", label: "Owner Only", icon: User, description: "Only the record owner can see this record" },
    { value: "team", label: "Team", icon: Users, description: "All team members can see this record" },
    { value: "department", label: "Department", icon: Building, description: "All department members can see this record" },
    { value: "organization", label: "Organization", icon: Globe, description: "All users in the organization can see this record" },
    { value: "public", label: "Public", icon: Globe, description: "Anyone with access to the system can see this record" },
  ];

  const teams = [
    { id: "sales", name: "Sales Team", members: 12, color: "bg-blue-500" },
    { id: "marketing", name: "Marketing Team", members: 8, color: "bg-green-500" },
    { id: "support", name: "Support Team", members: 6, color: "bg-purple-500" },
    { id: "management", name: "Management", members: 4, color: "bg-yellow-500" },
  ];

  const departments = [
    { id: "sales_dept", name: "Sales Department", teams: ["sales", "management"] },
    { id: "marketing_dept", name: "Marketing Department", teams: ["marketing"] },
    { id: "support_dept", name: "Support Department", teams: ["support"] },
  ];

  const defaultRules = {
    leads: {
      default: "team",
      rules: [
        { id: "rule1", field: "value", condition: "greater_than", value: 10000, visibility: "organization" },
        { id: "rule2", field: "status", condition: "equals", value: "qualified", visibility: "department" },
      ],
    },
    contacts: {
      default: "team",
      rules: [
        { id: "rule3", field: "company", condition: "equals", value: "enterprise", visibility: "organization" },
      ],
    },
    deals: {
      default: "team",
      rules: [
        { id: "rule4", field: "value", condition: "greater_than", value: 50000, visibility: "organization" },
        { id: "rule5", field: "stage", condition: "equals", value: "closed_won", visibility: "public" },
      ],
    },
  };

  const getVisibilityIcon = (level) => {
    const levelConfig = visibilityLevels.find(l => l.value === level);
    const Icon = levelConfig?.icon || Globe;
    return <Icon className="w-4 h-4" />;
  };

  const getVisibilityColor = (level) => {
    switch (level) {
      case "owner":
        return "bg-gray-100 text-gray-800";
      case "team":
        return "bg-blue-100 text-blue-800";
      case "department":
        return "bg-green-100 text-green-800";
      case "organization":
        return "bg-purple-100 text-purple-800";
      case "public":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDefaultVisibilityChange = (module, level) => {
    setVisibilityRules(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        default: level,
      },
    }));
  };

  const handleRuleChange = (module, ruleId, field, value) => {
    setVisibilityRules(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        rules: prev[module]?.rules?.map(rule => 
          rule.id === ruleId ? { ...rule, [field]: value } : rule
        ) || [],
      },
    }));
  };

  const addRule = (module) => {
    const newRule = {
      id: `rule_${Date.now()}`,
      field: "status",
      condition: "equals",
      value: "",
      visibility: "team",
    };
    
    setVisibilityRules(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        rules: [...(prev[module]?.rules || []), newRule],
      },
    }));
  };

  const removeRule = (module, ruleId) => {
    setVisibilityRules(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        rules: prev[module]?.rules?.filter(rule => rule.id !== ruleId) || [],
      },
    }));
  };

  const currentRules = visibilityRules[selectedModule] || defaultRules[selectedModule] || { default: "team", rules: [] };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Team Visibility Settings</h3>
          <p className="text-sm text-gray-600">
            Control who can see records based on teams, departments, and custom rules
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowAddRule(!showAddRule)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Rule
          </Button>
          <Button size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>

      {/* Module Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Module
        </label>
        <Select
          value={selectedModule}
          onChange={setSelectedModule}
          options={modules}
        />
      </div>

      {/* Default Visibility Level */}
      <Card className="p-6 mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Default Visibility Level</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibilityLevels.map((level) => {
            const Icon = level.icon;
            return (
              <div
                key={level.value}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  currentRules.default === level.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleDefaultVisibilityChange(selectedModule, level.value)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 ${getVisibilityColor(level.value)} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-gray-900">{level.label}</span>
                </div>
                <p className="text-sm text-gray-600">{level.description}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Teams Overview */}
      <Card className="p-6 mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Teams & Departments</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-medium text-gray-900 mb-3">Teams</h5>
            <div className="space-y-2">
              {teams.map((team) => (
                <div key={team.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 ${team.color} rounded-full`}></div>
                    <span className="font-medium text-gray-900">{team.name}</span>
                  </div>
                  <Badge variant="outline">{team.members} members</Badge>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-3">Departments</h5>
            <div className="space-y-2">
              {departments.map((dept) => (
                <div key={dept.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{dept.name}</span>
                  <Badge variant="outline">{dept.teams.length} teams</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Custom Rules */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Custom Visibility Rules</h4>
        <p className="text-sm text-gray-600 mb-4">
          Create rules to override default visibility based on field values
        </p>

        <div className="space-y-4">
          {currentRules.rules.map((rule) => (
            <div key={rule.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field
                  </label>
                  <Select
                    value={rule.field}
                    onChange={(value) => handleRuleChange(selectedModule, rule.id, "field", value)}
                    options={[
                      { value: "status", label: "Status" },
                      { value: "value", label: "Value" },
                      { value: "company", label: "Company" },
                      { value: "stage", label: "Stage" },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition
                  </label>
                  <Select
                    value={rule.condition}
                    onChange={(value) => handleRuleChange(selectedModule, rule.id, "condition", value)}
                    options={[
                      { value: "equals", label: "Equals" },
                      { value: "not_equals", label: "Not Equals" },
                      { value: "greater_than", label: "Greater Than" },
                      { value: "less_than", label: "Less Than" },
                      { value: "contains", label: "Contains" },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Value
                  </label>
                  <Input
                    value={rule.value}
                    onChange={(e) => handleRuleChange(selectedModule, rule.id, "value", e.target.value)}
                    placeholder="Enter value"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visibility
                    </label>
                    <Select
                      value={rule.visibility}
                      onChange={(value) => handleRuleChange(selectedModule, rule.id, "visibility", value)}
                      options={visibilityLevels.map(level => ({
                        value: level.value,
                        label: level.label
                      }))}
                    />
                  </div>
                  <button
                    onClick={() => removeRule(selectedModule, rule.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {currentRules.rules.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No custom rules defined</p>
              <p className="text-sm">Click "Add Rule" to create visibility rules</p>
            </div>
          )}
        </div>

        <div className="mt-4">
          <Button
            variant="outline"
            onClick={() => addRule(selectedModule)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Rule
          </Button>
        </div>
      </Card>

      {/* Visibility Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Default Level</p>
              <p className="text-lg font-bold text-gray-900 capitalize">
                {currentRules.default}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Custom Rules</p>
              <p className="text-lg font-bold text-gray-900">
                {currentRules.rules.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Teams</p>
              <p className="text-lg font-bold text-gray-900">
                {teams.length}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

