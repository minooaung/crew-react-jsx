import React from "react";
import { Link } from "react-router-dom";

/**
 * Reusable Button Component
 * 
 * @param {Object} props
 * @param {string} props.variant - Button style variant: 'primary', 'secondary', 'danger', 'auth', 'link', 'pagination', 'pagination-nav', 'pagination-active', 'small'
 * @param {string} props.size - Button size: 'sm', 'md', 'lg', 'full'
 * @param {string} props.type - Button type: 'button', 'submit', 'reset'
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {boolean} props.loading - Whether button is in loading state
 * @param {string} props.loadingText - Text to show when loading
 * @param {function} props.onClick - Click handler
 * @param {string} props.to - React Router Link destination (makes it a Link instead of button)
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 * @param {React.ReactNode} props.icon - Icon element to display
 * @param {string} props.iconPosition - Icon position: 'left', 'right'
 */
export default function Button({
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  loading = false,
  loadingText,
  onClick,
  to,
  className = "",
  children,
  icon,
  iconPosition = "left",
  ...props
}) {
  // Base classes that apply to all buttons
  const baseClasses = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none";

  // Variant classes
  const variantClasses = {
    // Primary blue button (most common)
    primary: "border border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50",
    
    // Secondary button (white with border)
    secondary: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50",
    
    // Danger/Delete button (red text)
    danger: "text-red-600 hover:text-red-900 bg-transparent border-none shadow-none p-0",
    
    // Auth buttons (purple theme for login/signup)
    auth: "text-white bg-purple-800 hover:bg-purple-900 disabled:opacity-70 disabled:cursor-not-allowed border-none",
    
    // Link style buttons (blue text, no background)
    link: "text-blue-600 hover:text-blue-900 bg-transparent border-none shadow-none p-0",
    
    // Pagination buttons (gray theme)
    pagination: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50",
    
    // Pagination navigation buttons (with icons)
    paginationNav: "border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50",
    
    // Active pagination button
    paginationActive: "border border-blue-500 bg-blue-50 text-blue-600 z-10",
    
    // Small buttons (like close buttons in tags)
    small: "text-blue-400 hover:bg-blue-200 hover:text-blue-600 bg-transparent border-none shadow-none rounded-full h-4 w-4"
  };

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-md",
    lg: "px-6 py-3 text-base rounded-md",
    full: "w-full py-4 px-4 text-base", // For auth forms
    
    // Special sizes for specific variants
    "pagination-sm": "px-4 py-2 text-sm rounded-md",
    "pagination-nav": "px-2 py-2 text-sm",
    "pagination-nav-left": "px-2 py-2 rounded-l-md text-sm",
    "pagination-nav-right": "px-2 py-2 rounded-r-md text-sm",
    "small-button": "h-4 w-4 text-xs"
  };

  // Determine size class based on variant and size
  let appliedSizeClass = sizeClasses[size];
  
  // Override size for specific variants
  if (variant === "auth") {
    appliedSizeClass = sizeClasses.full;
  } else if (variant === "pagination") {
    appliedSizeClass = sizeClasses["pagination-sm"];
  } else if (variant === "paginationNav") {
    appliedSizeClass = sizeClasses["pagination-nav"];
  } else if (variant === "small") {
    appliedSizeClass = sizeClasses["small-button"];
  }

  // Shadow classes (most buttons have shadow except some variants)
  const shadowClasses = ["danger", "link", "small", "paginationActive"].includes(variant) 
    ? "" 
    : "shadow-sm";

  // Combine all classes
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${appliedSizeClass} ${shadowClasses} ${className}`.trim();

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg 
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Content with icon and loading state
  const buttonContent = (
    <>
      {loading && <LoadingSpinner />}
      {!loading && icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
      {loading ? (loadingText || children) : children}
      {!loading && icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
    </>
  );

  // Render as Link if 'to' prop is provided
  if (to) {
    return (
      <Link
        to={to}
        className={buttonClasses}
        {...props}
      >
        {buttonContent}
      </Link>
    );
  }

  // Render as button
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={buttonClasses}
      {...props}
    >
      {buttonContent}
    </button>
  );
}

// Named export for specific button variants (for convenience)
export const PrimaryButton = (props) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props) => <Button variant="secondary" {...props} />;
export const DangerButton = (props) => <Button variant="danger" {...props} />;
export const AuthButton = (props) => <Button variant="auth" {...props} />;
export const LinkButton = (props) => <Button variant="link" {...props} />;
export const PaginationButton = (props) => <Button variant="pagination" {...props} />;
