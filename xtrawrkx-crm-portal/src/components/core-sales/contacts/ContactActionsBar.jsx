"use client";

import { useState } from "react";
import { Button, Modal, Input, Textarea, Select, Card } from "@xtrawrkx/ui";
import {
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  FileText,
  Plus,
  User,
  DollarSign,
  Clock,
  CheckCircle,
  X,
  Send,
  Save
} from "lucide-react";

export default function ContactActionsBar({ contact, onAction }) {
  const [showCallModal, setShowCallModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const [callData, setCallData] = useState({
    outcome: "positive",
    duration: 30,
    notes: "",
    nextStep: "",
    scheduledFollowUp: ""
  });

  const [emailData, setEmailData] = useState({
    subject: "",
    template: "",
    message: "",
    type: "follow_up"
  });

  const [meetingData, setMeetingData] = useState({
    title: "",
    date: "",
    duration: 60,
    location: "",
    attendees: "",
    agenda: ""
  });

  const [noteData, setNoteData] = useState({
    title: "",
    content: "",
    type: "general",
    tags: []
  });

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    assignee: ""
  });

  const emailTemplates = [
    { value: "follow_up", label: "Follow-up" },
    { value: "proposal", label: "Proposal" },
    { value: "meeting_request", label: "Meeting Request" },
    { value: "thank_you", label: "Thank You" },
    { value: "custom", label: "Custom" }
  ];

  const callOutcomes = [
    { value: "positive", label: "Positive", color: "text-green-600" },
    { value: "neutral", label: "Neutral", color: "text-yellow-600" },
    { value: "negative", label: "Negative", color: "text-red-600" },
    { value: "no_answer", label: "No Answer", color: "text-gray-600" }
  ];

  const noteTypes = [
    { value: "general", label: "General" },
    { value: "meeting", label: "Meeting Notes" },
    { value: "call", label: "Call Notes" },
    { value: "email", label: "Email Notes" },
    { value: "follow_up", label: "Follow-up" }
  ];

  const priorities = [
    { value: "low", label: "Low", color: "text-green-600" },
    { value: "medium", label: "Medium", color: "text-yellow-600" },
    { value: "high", label: "High", color: "text-red-600" }
  ];

  const handleCall = () => {
    // Here you would typically initiate a call via your telephony system
    console.log("Initiating call to:", contact?.phone);
    setShowCallModal(true);
  };

  const handleEmail = () => {
    setShowEmailModal(true);
  };

  const handleMeeting = () => {
    setShowMeetingModal(true);
  };

  const handleNote = () => {
    setShowNoteModal(true);
  };

  const handleTask = () => {
    setShowTaskModal(true);
  };

  const handleCallSubmit = () => {
    onAction('call', callData);
    setShowCallModal(false);
    setCallData({
      outcome: "positive",
      duration: 30,
      notes: "",
      nextStep: "",
      scheduledFollowUp: ""
    });
  };

  const handleEmailSubmit = () => {
    onAction('email', emailData);
    setShowEmailModal(false);
    setEmailData({
      subject: "",
      template: "",
      message: "",
      type: "follow_up"
    });
  };

  const handleMeetingSubmit = () => {
    onAction('meeting', meetingData);
    setShowMeetingModal(false);
    setMeetingData({
      title: "",
      date: "",
      duration: 60,
      location: "",
      attendees: "",
      agenda: ""
    });
  };

  const handleNoteSubmit = () => {
    onAction('note', noteData);
    setShowNoteModal(false);
    setNoteData({
      title: "",
      content: "",
      type: "general",
      tags: []
    });
  };

  const handleTaskSubmit = () => {
    onAction('task', taskData);
    setShowTaskModal(false);
    setTaskData({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      assignee: ""
    });
  };

  return (
    <>
      <div className="p-4 bg-gray-50 border-t border-brand-border">
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleCall}>
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
          <Button size="sm" variant="outline" onClick={handleEmail}>
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
          <Button size="sm" variant="outline" onClick={handleMeeting}>
            <Calendar className="w-4 h-4 mr-2" />
            Meeting
          </Button>
          <Button size="sm" variant="outline" onClick={handleNote}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Note
          </Button>
          <Button size="sm" variant="outline" onClick={handleTask}>
            <Plus className="w-4 h-4 mr-2" />
            Task
          </Button>
        </div>
      </div>

      {/* Call Modal */}
      <Modal isOpen={showCallModal} onClose={() => setShowCallModal(false)} size="md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-brand-foreground">Log Call</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowCallModal(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <Phone className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Calling {contact?.firstName} {contact?.lastName}</p>
                <p className="text-sm text-blue-700">{contact?.phone}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Call Outcome
              </label>
              <Select
                value={callData.outcome}
                onValueChange={(value) => setCallData(prev => ({ ...prev, outcome: value }))}
              >
                {callOutcomes.map((outcome) => (
                  <option key={outcome.value} value={outcome.value}>
                    {outcome.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-2">
                  Duration (minutes)
                </label>
                <Input
                  type="number"
                  value={callData.duration}
                  onChange={(e) => setCallData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                  placeholder="30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-2">
                  Next Follow-up
                </label>
                <Input
                  type="date"
                  value={callData.scheduledFollowUp}
                  onChange={(e) => setCallData(prev => ({ ...prev, scheduledFollowUp: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Call Notes
              </label>
              <Textarea
                value={callData.notes}
                onChange={(e) => setCallData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="What was discussed during the call?"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Next Step
              </label>
              <Input
                value={callData.nextStep}
                onChange={(e) => setCallData(prev => ({ ...prev, nextStep: e.target.value }))}
                placeholder="What's the next action?"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-brand-border mt-6">
            <Button variant="outline" onClick={() => setShowCallModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCallSubmit}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Log Call
            </Button>
          </div>
        </div>
      </Modal>

      {/* Email Modal */}
      <Modal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} size="lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-brand-foreground">Send Email</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowEmailModal(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <Mail className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">To: {contact?.firstName} {contact?.lastName}</p>
                <p className="text-sm text-green-700">{contact?.email}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Email Template
              </label>
              <Select
                value={emailData.template}
                onValueChange={(value) => setEmailData(prev => ({ ...prev, template: value }))}
              >
                {emailTemplates.map((template) => (
                  <option key={template.value} value={template.value}>
                    {template.label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Subject
              </label>
              <Input
                value={emailData.subject}
                onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Enter email subject"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Message
              </label>
              <Textarea
                value={emailData.message}
                onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Enter your message..."
                rows={6}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-brand-border mt-6">
            <Button variant="outline" onClick={() => setShowEmailModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleEmailSubmit}>
              <Send className="w-4 h-4 mr-2" />
              Send Email
            </Button>
          </div>
        </div>
      </Modal>

      {/* Meeting Modal */}
      <Modal isOpen={showMeetingModal} onClose={() => setShowMeetingModal(false)} size="md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-brand-foreground">Schedule Meeting</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowMeetingModal(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Meeting Title
              </label>
              <Input
                value={meetingData.title}
                onChange={(e) => setMeetingData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter meeting title"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-2">
                  Date & Time
                </label>
                <Input
                  type="datetime-local"
                  value={meetingData.date}
                  onChange={(e) => setMeetingData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-2">
                  Duration (minutes)
                </label>
                <Input
                  type="number"
                  value={meetingData.duration}
                  onChange={(e) => setMeetingData(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                  placeholder="60"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Location
              </label>
              <Input
                value={meetingData.location}
                onChange={(e) => setMeetingData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Meeting room, video call, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Attendees
              </label>
              <Input
                value={meetingData.attendees}
                onChange={(e) => setMeetingData(prev => ({ ...prev, attendees: e.target.value }))}
                placeholder="Enter attendee emails (comma separated)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Agenda
              </label>
              <Textarea
                value={meetingData.agenda}
                onChange={(e) => setMeetingData(prev => ({ ...prev, agenda: e.target.value }))}
                placeholder="What will be discussed in this meeting?"
                rows={3}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-brand-border mt-6">
            <Button variant="outline" onClick={() => setShowMeetingModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleMeetingSubmit}>
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
          </div>
        </div>
      </Modal>

      {/* Note Modal */}
      <Modal isOpen={showNoteModal} onClose={() => setShowNoteModal(false)} size="md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-brand-foreground">Add Note</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowNoteModal(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Note Type
              </label>
              <Select
                value={noteData.type}
                onValueChange={(value) => setNoteData(prev => ({ ...prev, type: value }))}
              >
                {noteTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Title
              </label>
              <Input
                value={noteData.title}
                onChange={(e) => setNoteData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter note title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Content
              </label>
              <Textarea
                value={noteData.content}
                onChange={(e) => setNoteData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter your notes..."
                rows={5}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-brand-border mt-6">
            <Button variant="outline" onClick={() => setShowNoteModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleNoteSubmit}>
              <Save className="w-4 h-4 mr-2" />
              Save Note
            </Button>
          </div>
        </div>
      </Modal>

      {/* Task Modal */}
      <Modal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} size="md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-brand-foreground">Create Task</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowTaskModal(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Task Title
              </label>
              <Input
                value={taskData.title}
                onChange={(e) => setTaskData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter task title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Description
              </label>
              <Textarea
                value={taskData.description}
                onChange={(e) => setTaskData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter task description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-2">
                  Priority
                </label>
                <Select
                  value={taskData.priority}
                  onValueChange={(value) => setTaskData(prev => ({ ...prev, priority: value }))}
                >
                  {priorities.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-2">
                  Due Date
                </label>
                <Input
                  type="date"
                  value={taskData.dueDate}
                  onChange={(e) => setTaskData(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Assign To
              </label>
              <Input
                value={taskData.assignee}
                onChange={(e) => setTaskData(prev => ({ ...prev, assignee: e.target.value }))}
                placeholder="Enter assignee name"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-brand-border mt-6">
            <Button variant="outline" onClick={() => setShowTaskModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleTaskSubmit}>
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
