import { convertToDate, formatDate } from './dateUtils';

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Event day is before today. */
export function isEventPast(eventDate) {
  const eventDateTime = convertToDate(eventDate);
  if (!eventDateTime) return false;
  return startOfDay(eventDateTime) < startOfDay(new Date());
}

/** Registration deadline day is before today (deadline day is still open). */
export function isRegistrationDeadlinePassed(deadline) {
  const deadlineDate = convertToDate(deadline);
  if (!deadlineDate) return false;
  return startOfDay(deadlineDate) < startOfDay(new Date());
}

/** Whether public registration should be available for an event. */
export function isRegistrationOpen(event) {
  if (!event) return false;
  if (event.registrationEnabled === false) return false;
  if (event.status === 'cancelled') return false;
  if (isEventPast(event.date)) return false;
  if (isRegistrationDeadlinePassed(event.registrationDeadline)) return false;
  return true;
}

export function getRegistrationClosedMessage(event) {
  if (!event) return 'Registration is not available.';
  if (event.registrationEnabled === false) {
    return 'Registration has been disabled for this event.';
  }
  if (event.status === 'cancelled') {
    return 'This event has been cancelled.';
  }
  if (isEventPast(event.date)) {
    return 'This event has already taken place.';
  }
  if (isRegistrationDeadlinePassed(event.registrationDeadline)) {
    const deadlineLabel = formatDate(event.registrationDeadline);
    return deadlineLabel
      ? `Registration closed on ${deadlineLabel}.`
      : 'Registration deadline has passed.';
  }
  return 'Registration is not available.';
}
