import React, { useState } from 'react';
import axios from 'axios';
import RatingSelect from "@/components/RatingSelect";
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const CreatePost = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: courseId || '',
    review: '',
    rating: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (rating) => {
    setForm((prev) => ({ ...prev, rating }));
  };

  const validateForm = () => {
    const { name, phone, email, service, review, rating } = form;

    if (!name || !phone || !email || !service || !review) {
      alert('Please fill in all fields.');
      return false;
    }

    if (rating === null) {
      alert('Please select a rating.');
      return false;
    }

    if (phone.trim().length !== 10 || !/^\d{10}$/.test(phone)) {
      alert('Phone number must be exactly 10 digits.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/posts/post/save",
        form
      );

      if (res.data.success) {
        alert('Feedback submitted successfully!');
        navigate('/feedback');
      } else {
        alert('Submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <Card className="p-6 space-y-6">
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold mb-4">
            <center>How would you rate your experience?</center>
          </h2>
          <RatingSelect select={handleRatingChange} selected={form.rating} />

          <Input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="mt-4"
          />
          <Input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="mt-4"
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="mt-4"
          />
          <Input
            type="text"
            name="service"
            placeholder="Course Name"
            value={form.service}
            onChange={handleChange}
            className="mt-4"
          />
          <Textarea
            name="review"
            placeholder="Write your review..."
            rows={4}
            value={form.review}
            onChange={handleChange}
            className="mt-4"
          />
          <Button type="submit" className="mt-6 w-full">
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CreatePost;
