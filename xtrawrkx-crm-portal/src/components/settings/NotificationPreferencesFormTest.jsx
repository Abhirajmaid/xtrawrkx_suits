"use client";

import { useState } from "react";
import { Card, Button, Checkbox, Select, Badge } from "../../components/ui";

export default function NotificationPreferencesFormTest() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Notification Preferences Test</h3>
          <p className="text-sm text-gray-600">
            Test component to isolate the issue
          </p>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      <Card className="p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Test Settings</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Input
            </label>
            <Select
              options={[
                { value: "option1", label: "Option 1" },
                { value: "option2", label: "Option 2" }
              ]}
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="flex items-center gap-2">
              <Checkbox
                checked={isEditing}
                onChange={(checked) => setIsEditing(checked)}
              />
              <span className="text-sm text-gray-700">Test Checkbox</span>
            </label>
          </div>
          <div>
            <Badge variant="primary">Test Badge</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
