import React from 'react';
import { Link } from 'react-router-dom';

export default function AdultTutorGate({ onConfirm, onClose }) {
  return (
    <div className="p-4 space-y-4 overflow-y-auto text-sm text-darkGrey">
      <h3 className="font-bold text-lg">AI tutor: ages 18 and older</h3>
      <p>You must be at least 18 to use the AI tutor. Students under 18 can continue using lessons, quizzes, and calculators without AI chat.</p>
      <p>Messages are sent to Chatbase, an external AI service. Do not share personal or sensitive information. AI can make mistakes.</p>
      <p><Link to="/privacy" className="underline">Privacy</Link> · <Link to="/terms" className="underline">Terms</Link></p>
      <button autoFocus type="button" onClick={onConfirm} className="block w-full rounded-lg bg-darkTeal text-white px-4 py-3 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">I confirm I am 18 or older</button>
      <button type="button" onClick={onClose} className="block w-full rounded-lg border border-darkTeal px-4 py-3 focus-visible:outline focus-visible:outline-2">Continue without AI</button>
    </div>
  );
}
