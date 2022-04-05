import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Job from "./job";

function EditJob({
  job,
  setJob,
  submit,
}: {
  job: Job;
  setJob: (job: Job) => void;
  submit: (job: Job) => void;
}) {
  if (job.notes.length === 0) setJob({ ...job, notes: [""] });

  const handleNote = (note: string, index: number) => {
    const newJob = { ...job };
    newJob.notes = newJob.notes.map((oldNote, noteIndex) =>
      noteIndex === index ? note : oldNote
    );
    if (index >= newJob.notes.length - 1) newJob.notes.push("");
    setJob(newJob);
  };

  const removeNote = (index: number) => {
    const newJob = { ...job };
    newJob.notes = newJob.notes.filter(
      (_note, noteIndex) => noteIndex !== index
    );
    setJob(newJob);
  };

  const statuses = [
    "scheduled",
    "active",
    "invoicing",
    "to priced",
    "completed",
  ];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit(job);
      }}
    >
      <label>
        Status
        <select
          value={job.status}
          onChange={(change) => setJob({ ...job, status: change.target.value })}
        >
          {statuses.map((status) => (
            <option>{status}</option>
          ))}
        </select>
      </label>
      <label>
        Name
        <input
          value={job.name}
          onChange={(change) => setJob({ ...job, name: change.target.value })}
          required
        />
      </label>
      <label>
        Phone
        <input
          type="tel"
          value={job.phone}
          onChange={(change) => setJob({ ...job, phone: change.target.value })}
          required
        />
      </label>
      {job.notes.map((note, noteIndex) => (
        <label key={noteIndex}>
          Note
          <input
            value={note}
            onChange={(e) => handleNote(e.target.value, noteIndex)}
          />
          <button onClick={() => removeNote(noteIndex)}>Remove</button>
        </label>
      ))}
      <button>Submit</button>
    </form>
  );
}

export default EditJob;
