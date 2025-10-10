"use client";

import { useState } from "react";
import { Card, Button, Select, Checkbox, Badge } from "../../components/ui";
import {
  Save,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Edit,
  Trash2,
  Plus,
  Info,
} from "lucide-react";

export default function FieldLevelSecurityForm() {
  const [selectedModule, setSelectedModule] = useState("leads");
  const [selectedRole, setSelectedRole] = useState("sales_rep");
  const [fieldSecurity, setFieldSecurity] = useState({});

  const modules = [
    { value: "leads", label: "Leads" },
    { value: "contacts", label: "Contacts" },
    { value: "deals", label: "Deals" },
    { value: "accounts", label: "Accounts" },
    { value: "activities", label: "Activities" },
  ];

  const roles = [
    { value: "admin", label: "Administrator" },
    { value: "sales_manager", label: "Sales Manager" },
    { value: "sales_rep", label: "Sales Rep" },
    { value: "viewer", label: "Viewer" },
  ];

  const fieldDefinitions = {
    leads: [
      { name: "name", label: "Lead Name", type: "text", required: true },
      { name: "email", label: "Email Address", type: "email", required: true },
      { name: "phone", label: "Phone Number", type: "tel", required: false },
      { name: "company", label: "Company", type: "text", required: false },
      { name: "value", label: "Deal Value", type: "currency", required: false },
      { name: "source", label: "Lead Source", type: "select", required: false },
      { name: "status", label: "Status", type: "select", required: true },
      { name: "notes", label: "Notes", type: "textarea", required: false },
      { name: "assigned_to", label: "Assigned To", type: "user", required: false },
    ],
    contacts: [
      { name: "first_name", label: "First Name", type: "text", required: true },
      { name: "last_name", label: "Last Name", type: "text", required: true },
      { name: "email", label: "Email Address", type: "email", required: true },
      { name: "phone", label: "Phone Number", type: "tel", required: false },
      { name: "title", label: "Job Title", type: "text", required: false },
      { name: "department", label: "Department", type: "text", required: false },
      { name: "address", label: "Address", type: "textarea", required: false },
      { name: "birthday", label: "Birthday", type: "date", required: false },
      { name: "notes", label: "Notes", type: "textarea", required: false },
    ],
    deals: [
      { name: "name", label: "Deal Name", type: "text", required: true },
      { name: "value", label: "Deal Value", type: "currency", required: true },
      { name: "stage", label: "Stage", type: "select", required: true },
      { name: "probability", label: "Probability", type: "number", required: false },
      { name: "close_date", label: "Close Date", type: "date", required: false },
      { name: "account", label: "Account", type: "lookup", required: false },
      { name: "contact", label: "Contact", type: "lookup", required: false },
      { name: "description", label: "Description", type: "textarea", required: false },
      { name: "assigned_to", label: "Assigned To", type: "user", required: false },
    ],
  };

  const getFieldSecurity = (module, role, field) => {
    const key = `${module}_${role}_${field}`;
    return fieldSecurity[key] || {
      visible: true,
      editable: true,
      required: false,
    };
  };

  const updateFieldSecurity = (module, role, field, property, value) => {
    const key = `${module}_${role}_${field}`;
    setFieldSecurity(prev => ({
      ...prev,
      [key]: {
        ...getFieldSecurity(module, role, field),
        [property]: value,
      },
    }));
  };

  const getFieldTypeIcon = (type) => {
    switch (type) {
      case "text":
      case "email":
      case "tel":
        return <Edit className="w-4 h-4" />;
      case "currency":
      case "number":
        return <Edit className="w-4 h-4" />;
      case "select":
        return <Edit className="w-4 h-4" />;
      case "textarea":
        return <Edit className="w-4 h-4" />;
      case "date":
        return <Edit className="w-4 h-4" />;
      case "user":
      case "lookup":
        return <Edit className="w-4 h-4" />;
      default:
        return <Edit className="w-4 h-4" />;
    }
  };

  const getSecurityLevel = (field) => {
    const security = getFieldSecurity(selectedModule, selectedRole, field.name);
    if (!security.visible) return "hidden";
    if (!security.editable) return "readonly";
    return "editable";
  };

  const getSecurityColor = (level) => {
    switch (level) {
      case "hidden":
        return "bg-red-100 text-red-800";
      case "readonly":
        return "bg-yellow-100 text-yellow-800";
      case "editable":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const fields = fieldDefinitions[selectedModule] || [];

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Field-Level Security</h3>
          <p className="text-sm text-gray-600">
            Control field visibility and editability by role
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Field
          </Button>
          <Button size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Module and Role Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Module
          </label>
          <Select
            value={selectedModule}
            onChange={setSelectedModule}
            options={modules}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <Select
            value={selectedRole}
            onChange={setSelectedRole}
            options={roles}
          />
        </div>
      </div>

      {/* Field Security Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Field
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Type
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                  Visible
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                  Editable
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                  Required
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                  Security Level
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {fields.map((field) => {
                const security = getFieldSecurity(selectedModule, selectedRole, field.name);
                const securityLevel = getSecurityLevel(field);
                
                return (
                  <tr key={field.name} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getFieldTypeIcon(field.type)}
                        <div>
                          <div className="font-medium text-gray-900">{field.label}</div>
                          <div className="text-sm text-gray-500">{field.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" size="sm">
                        {field.type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Checkbox
                        checked={security.visible}
                        onChange={(checked) => 
                          updateFieldSecurity(selectedModule, selectedRole, field.name, "visible", checked)
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Checkbox
                        checked={security.editable}
                        onChange={(checked) => 
                          updateFieldSecurity(selectedModule, selectedRole, field.name, "editable", checked)
                        }
                        disabled={!security.visible}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Checkbox
                        checked={security.required}
                        onChange={(checked) => 
                          updateFieldSecurity(selectedModule, selectedRole, field.name, "required", checked)
                        }
                        disabled={!security.visible || !security.editable}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        variant="default"
                        size="sm"
                        className={getSecurityColor(securityLevel)}
                      >
                        {securityLevel}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Info className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Trash2 className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Security Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Visible Fields</p>
              <p className="text-2xl font-bold text-gray-900">
                {fields.filter(field => 
                  getFieldSecurity(selectedModule, selectedRole, field.name).visible
                ).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Edit className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Editable Fields</p>
              <p className="text-2xl font-bold text-gray-900">
                {fields.filter(field => {
                  const security = getFieldSecurity(selectedModule, selectedRole, field.name);
                  return security.visible && security.editable;
                }).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Read-Only Fields</p>
              <p className="text-2xl font-bold text-gray-900">
                {fields.filter(field => {
                  const security = getFieldSecurity(selectedModule, selectedRole, field.name);
                  return security.visible && !security.editable;
                }).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <EyeOff className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Hidden Fields</p>
              <p className="text-2xl font-bold text-gray-900">
                {fields.filter(field => 
                  !getFieldSecurity(selectedModule, selectedRole, field.name).visible
                ).length}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

