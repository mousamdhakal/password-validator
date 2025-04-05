import React from 'react';

const PasswordGenerator = ({ onGeneratePassword }) => {
  // Generate a strong password
  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const allChars = uppercase + lowercase + numbers + special;
    let newPassword = '';
    
    // Ensure at least one of each type
    newPassword += uppercase[Math.floor(Math.random() * uppercase.length)];
    newPassword += lowercase[Math.floor(Math.random() * lowercase.length)];
    newPassword += numbers[Math.floor(Math.random() * numbers.length)];
    newPassword += special[Math.floor(Math.random() * special.length)];
    
    // Add more random characters
    for (let i = 0; i < 8; i++) {
      newPassword += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    newPassword = newPassword.split('').sort(() => 0.5 - Math.random()).join('');
    
    onGeneratePassword(newPassword);
  };

  return (
    <button 
      className="generate-button"
      onClick={generatePassword}
    >
      Generate Strong Password
    </button>
  );
};

export default PasswordGenerator;