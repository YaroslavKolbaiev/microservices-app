'use client';

const TermsAndConditions = () => {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          id="terms"
          aria-describedby="terms"
          type="checkbox"
          className="w-4
            h-4 
            border 
            border-gray-300 
            rounded 
            bg-gray-50 
            focus:ring-3 
            focus:ring-sky-300 
            dark:bg-gray-700 
            dark:border-gray-600 
            dark:focus:ring-sky-600 
            dark:ring-offset-gray-800
          "
          required
        />
      </div>
      <div className="ml-3 text-sm">
        <label
          htmlFor="terms"
          className="font-light text-gray-500 dark:text-gray-300"
        >
          I accept the{' '}
          <a
            className="font-medium text-sky-600 hover:underline dark:text-sky-500"
            href="#"
          >
            Terms and Conditions
          </a>
        </label>
      </div>
    </div>
  );
};

export default TermsAndConditions;
