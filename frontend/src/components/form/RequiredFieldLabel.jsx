import PropTypes from 'prop-types';

const RequiredFieldLabel = ({ children, required = false, className = "" }) => {
  return (
    <label className={`block text-sm font-medium text-gray-700 mb-2 ${className}`}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

RequiredFieldLabel.propTypes = {
  children: PropTypes.node.isRequired,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default RequiredFieldLabel; 