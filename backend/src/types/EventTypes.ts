// context for all: receiver_utorid, receiver_full_name, receiver_email, frontend_url
enum EventTypes {
  // context: full_name, room, room_friendly, group_name, booking_id, title, description, start_time, end_time, utorid
  ADMIN_BOOKING_CREATED = 'ADMIN_BOOKING_CREATED',
  // context: full_name, room, room_friendly, group_name, booking_id, title, description, start_time, end_time, utorid
  BOOKING_APPROVAL_REQUESTED = 'BOOKING_APPROVAL_REQUESTED',
  // context: full_name, room, room_friendly, group_name, booking_id, title, description, start_time, end_time, utorid, changer_utorid, changer_full_name, status
  ADMIN_BOOKING_UPDATED = 'ADMIN_BOOKING_UPDATED',
  // context: full_name, room, room_friendly, group_name, booking_id, title, description, start_time, end_time, utorid, changer_utorid, changer_full_name, status, reason?
  BOOKING_STATUS_CHANGED = 'BOOKING_STATUS_CHANGED',
  ADMIN_BOOKING_STATUS_CHANGED = 'ADMIN_BOOKING_STATUS_CHANGED',
  // context: full_name, room, room_friendly, utorid, approver_utorid, approver_full_name
  ROOM_ACCESS_REQUESTED = 'ROOM_ACCESS_REQUESTED',
  ROOM_ACCESS_GRANTED = 'ROOM_ACCESS_GRANTED',
  ADMIN_ROOM_ACCESS_GRANTED = 'ADMIN_ROOM_ACCESS_GRANTED',
  // context: full_name, room, room_friendly, utorid, capacity
  ADMIN_ROOM_CREATED = 'ADMIN_ROOM_CREATED',
  // context: full_name, room, room_friendly, utorid, approver_utorid, approver_full_name
  ROOM_ACCESS_REVOKED = 'ROOM_ACCESS_REVOKED',
  // context: full_name, room, room_friendly, utorid
  ADMIN_ROOM_ACCESS_REVOKED = 'ADMIN_ROOM_ACCESS_REVOKED',
  // context: full_name, group_name, group_id, utorid
  ADMIN_GROUP_CREATED = 'ADMIN_GROUP_CREATED',
  // context: full_name, group_name, group_id, group_id, utorid, inviter_utorid, inviter_full_name
  GROUP_MEMBER_INVITED = 'GROUP_MEMBER_INVITED',
  // context: full_name, group_name, group_id, utorid, inviter_utorid, inviter_full_name
  USER_INVITED_TO_GROUP = 'USER_INVITED_TO_GROUP',
  // context: full_name, group_name, group_id, utorid
  GROUP_MEMBER_JOINED = 'GROUP_MEMBER_JOINED',
  // context: full_name, group_name, group_id, utorid, remover_utorid, remover_full_name
  GROUP_MEMBER_REMOVED = 'GROUP_MEMBER_REMOVED',
  // context: full_name, group_name, group_id, utorid, remover_utorid, remover_full_name
  USER_REMOVED_FROM_GROUP = 'USER_REMOVED_FROM_GROUP',
  // context: full_name, group_name, group_id, utorid, changer_utorid, changer_full_name, role
  GROUP_ROLE_CHANGED = 'GROUP_ROLE_CHANGED',
  USER_GROUP_ROLE_CHANGED = 'MANAGER_GROUP_ROLE_CHANGED',
  // context: full_name, group_name, group_id, utorid
  GROUP_DELETED = 'GROUP_DELETED',
  // context: full_name, group_name, group_id, utorid
  ADMIN_GROUP_DELETED = 'ADMIN_GROUP_DELETED',
}

export default EventTypes;
