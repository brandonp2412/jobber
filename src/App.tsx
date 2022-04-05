import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Job from "./job";
import { v4 as uuid } from "uuid";
import EditJob from "./EditJob";

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof Job>("created");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const defaultJob = (): Job => ({
    created: new Date(),
    id: uuid(),
    name: "",
    notes: [""],
    phone: "",
    status: "scheduled",
  });

  const [job, setJob] = useState<Job>(defaultJob());

  const columns: { name: string; field: keyof Job }[] = [
    { name: "ID", field: "id" },
    { name: "Name", field: "name" },
    { name: "Status", field: "status" },
    { name: "Created", field: "created" },
    { name: "Phone", field: "phone" },
  ];

  const submit = (job: Job) => {
    const exists = jobs.find((j) => j.id === job.id);
    if (exists)
      setJobs(jobs.map((oldJob) => (oldJob.id === job.id ? job : oldJob)));
    else setJobs([...jobs, job]);
    setJob(defaultJob());
    setShow(false);
  };

  const removeJob = (index: number) => {
    setJobs(jobs.filter((_job, i) => i !== index));
  };

  const edit = (job: Job) => {
    setJob(job);
    setShow(true);
  };

  const handleSort = (field: keyof Job) => {
    setSortColumn(field);
    setSortDir(sortDir === "asc" ? "desc" : "asc");
  };

  const compareStrings = (a: string, b: string) => {
    if (sortDir === "asc") return a > b ? 1 : -1;
    else return a > b ? -1 : 1;
  };

  const sortJobs = (a: Job, b: Job) => {
    if (sortColumn === "created")
      return sortDir === "asc"
        ? a.created.getTime() - b.created.getTime()
        : b.created.getTime() - a.created.getTime();
    if (sortColumn === "id") return compareStrings(a.id, b.id);
    if (sortColumn === "name") return compareStrings(a.name, b.name);
    if (sortColumn === "phone") return compareStrings(a.phone, b.phone);
    if (sortColumn === "status") return compareStrings(a.status, b.status);
    return 0;
  };

  const filterJobs = (job: Job) => {
    return (
      job.name.toLowerCase().includes(search.toLowerCase()) ||
      job.phone.toLowerCase().includes(search.toLowerCase()) ||
      job.status.toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <>
      <div className="app">
        <h1>Jobs</h1>
        <input
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => setShow(true)}>Add job</button>
        {columns.map((column) => (
          <button
            className="title"
            key={column.field}
            onClick={() => handleSort(column.field)}
          >
            {column.name}{" "}
            {sortColumn === column.field && sortDir === "asc" && "↑"}
            {sortColumn === column.field && sortDir === "desc" && "↓"}
          </button>
        ))}
        <span></span>
        {jobs
          .filter(filterJobs)
          .sort(sortJobs)
          .map((job, index) => (
            <React.Fragment key={index}>
              <span>{job.id}</span>
              <span>{job.name}</span>
              <span>{job.status}</span>
              <span>{job.created.toLocaleString()}</span>
              <span>{job.phone}</span>
              <div>
                <button onClick={() => edit(job)}>Edit</button>
                <button onClick={() => removeJob(index)}>Remove</button>
              </div>
            </React.Fragment>
          ))}
      </div>
      <div
        style={{
          display: show ? "block" : "none",
        }}
        className="modal"
      >
        <div className="modal-content">
          <span className="close" onClick={() => setShow(false)}>
            &times;
          </span>
          <EditJob job={job} setJob={setJob} submit={submit} />
        </div>
      </div>
    </>
  );
}

export default App;
