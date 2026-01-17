// Import all models to ensure they're registered in Mongoose
import './User';
import './Patient';
import './Service';
import './Appointment';
import './Report';

export { default as User } from './User';
export { default as Patient } from './Patient';
export { default as Service } from './Service';
export { default as Appointment } from './Appointment';
export { default as Report } from './Report';
