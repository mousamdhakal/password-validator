import React, { useState, useRef } from 'react';
import PasswordGenerator from './PasswordGenerator';

const PasswordValidator = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  // Password requirements
  const requirements = [
    { name: 'length', description: 'At least 8 characters long', regex: /.{8,}/, weight: 2 },
    { name: 'uppercase', description: 'Contains at least one uppercase letter', regex: /[A-Z]/, weight: 1 },
    { name: 'lowercase', description: 'Contains at least one lowercase letter', regex: /[a-z]/, weight: 1 },
    { name: 'number', description: 'Contains at least one number', regex: /[0-9]/, weight: 1 },
    { name: 'special', description: 'Contains at least one special character', regex: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, weight: 1 },
    { name: 'noSpaces', description: 'No spaces', regex: /^[^ ]*$/, weight: 1 },
    { name: 'noSequential', description: 'No sequential characters (123, abc)', regex: /(?!.*(?:123|234|345|456|567|678|789|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz))/, weight: 1 }
  ];

  // Check each requirement
  const checkRequirements = () => {
    return requirements.map(req => ({
      ...req,
      passed: req.regex.test(password)
    }));
  };

  // Calculate password strength with improved logic
  const calculateStrength = (checkedReqs) => {
    // First check minimum requirements - must have at least 5 characters to not be "Weak"
    if (password.length < 5) {
      return { label: 'Weak', color: 'var(--weak-color)' };
    }
    
    // Calculate weighted score
    const totalWeight = requirements.reduce((sum, req) => sum + req.weight, 0);
    const passedWeight = checkedReqs
      .filter(req => req.passed)
      .reduce((sum, req) => sum + req.weight, 0);
    
    const percentage = (passedWeight / totalWeight) * 100;
    
    // Must have length requirement met to be "Strong"
    const lengthMet = checkedReqs.find(req => req.name === 'length').passed;
    
    if (percentage === 100) return { label: 'Strong', color: 'var(--strong-color)' };
    if (percentage >= 70 && lengthMet) return { label: 'Good', color: 'var(--good-color)' };
    if (percentage >= 40) return { label: 'Fair', color: 'var(--fair-color)' };
    return { label: 'Weak', color: 'var(--weak-color)' };
  };

  const handleGeneratedPassword = (newPassword) => {
    setPassword(newPassword);
  };

  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password).then(() => {
        setCopied(true);
        
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Set new timeout to clear the "Copied" message after 2 seconds
        timeoutRef.current = setTimeout(() => {
          setCopied(false);
        }, 2000);
      });
    }
  };

  const checkedRequirements = checkRequirements();
  const strength = calculateStrength(checkedRequirements);
  const allPassed = checkedRequirements.every(req => req.passed);
  
  // Separate passed and failed requirements
  const failedRequirements = checkedRequirements.filter(req => !req.passed);
  const passedRequirements = checkedRequirements.filter(req => req.passed);

  return (
    <div className="password-validator">
      <h2>Password Strength Checker</h2>
      
      <div className="password-input-container">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="password-input"
        />
        <button 
          className={`copy-button ${copied ? 'copied' : ''}`}
          onClick={copyToClipboard}
          disabled={!password}
          title="Copy password"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <button 
          className="toggle-password"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      
      <div className="password-strength">
        <div className="strength-meter">
          <div 
            className="strength-meter-fill" 
            style={{ 
              width: `${(checkedRequirements.filter(req => req.passed).length / requirements.length) * 100}%`,
              backgroundColor: strength.color
            }}
          ></div>
        </div>
        <span className="strength-label" style={{ color: strength.color }}>
          {password ? strength.label : "Enter a password"}
        </span>
      </div>
      
      {allPassed && (
        <div className="all-passed-message">
          <div className="big-tick">✓</div>
          <p>All requirements passed! Your password is strong.</p>
        </div>
      )}
            
      <div className="requirements-list">
        <h3>Password Requirements</h3>
        
        {failedRequirements.length > 0 && (
          <div className="failed-requirements">
            <ul>
              {failedRequirements.map((req, index) => (
                <li key={index} className="failed">
                  <span className="requirement-status">
                    ✗
                  </span>
                  {req.description}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {passedRequirements.length > 0 && (
          <div className="passed-requirements">
            <ul>
              {passedRequirements.map((req, index) => (
                <li key={index} className="passed">
                  <span className="requirement-status">
                    ✓
                  </span>
                  {req.description}
                </li>
              ))}
            </ul>
          </div>
        )}
              <PasswordGenerator onGeneratePassword={handleGeneratedPassword} />

      </div>
      
      <div className="creator-signature">
        Created by: Mousam Dhakal
      </div>
    </div>
  );
};

export default PasswordValidator;