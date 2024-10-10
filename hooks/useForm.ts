import { useState } from 'react';

interface FormData {
  [key: string]: string;
}

const useForm = (initialValues: FormData) => {
  const [formData, setFormData] = useState<FormData>(initialValues);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialValues);
  };

  return {
    formData,
    handleInputChange,
    resetForm,
  };
};

export default useForm;
