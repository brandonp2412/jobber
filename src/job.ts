export default interface Job {
  id: string;
  status: string;
  created: Date;
  name: string;
  phone: string;
  notes: string[];
}
