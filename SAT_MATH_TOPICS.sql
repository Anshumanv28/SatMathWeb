-- SAT Math Topics and Subtopics
-- Run this in your Supabase SQL Editor

-- First, clear existing data
DELETE FROM sat_content;
DELETE FROM sat_topics;

-- Insert the main SAT Math topics
INSERT INTO sat_topics (name, description, icon, color, sort_order) VALUES
('Heart of Algebra', 'Linear equations, inequalities, systems, and functions', '📐', '#EF4444', 1),
('Problem Solving & Data Analysis', 'Ratios, percentages, statistics, and data interpretation', '📊', '#10B981', 2),
('Passport to Advanced Math', 'Quadratic equations, polynomials, and advanced functions', '🔢', '#F59E0B', 3),
('Additional Topics in Math', 'Geometry, trigonometry, and complex numbers', '📏', '#8B5CF6', 4),
('General Math Skills', 'Word problems, estimation, and calculator-free techniques', '🎯', '#06B6D4', 5)
ON CONFLICT (name) DO NOTHING;

-- Insert subtopics for Heart of Algebra
INSERT INTO sat_content (topic, title, description, content_type, difficulty_level) VALUES
('Heart of Algebra', 'Linear equations in one variable', 'Master solving linear equations with one variable', 'pdf', 'easy'),
('Heart of Algebra', 'Linear inequalities in one variable', 'Understand and solve linear inequalities', 'pdf', 'easy'),
('Heart of Algebra', 'Systems of linear equations (two variables)', 'Solve systems using substitution and elimination', 'pdf', 'medium'),
('Heart of Algebra', 'Systems of linear inequalities', 'Graph and solve systems of inequalities', 'pdf', 'medium'),
('Heart of Algebra', 'Interpreting linear functions', 'Understand slope, intercepts, and graph features', 'pdf', 'medium'),
('Heart of Algebra', 'Word problems modeled by linear equations', 'Translate real-world problems into linear equations', 'pdf', 'hard');

-- Insert subtopics for Problem Solving & Data Analysis
INSERT INTO sat_content (topic, title, description, content_type, difficulty_level) VALUES
('Problem Solving & Data Analysis', 'Ratios, rates, proportions', 'Master proportional relationships and rates', 'pdf', 'easy'),
('Problem Solving & Data Analysis', 'Percentages (growth, decrease, compound interest)', 'Calculate percentages and compound interest', 'pdf', 'medium'),
('Problem Solving & Data Analysis', 'Unit conversions', 'Convert between different units of measurement', 'pdf', 'easy'),
('Problem Solving & Data Analysis', 'Scatterplots and trend lines', 'Analyze data using scatterplots and lines of best fit', 'pdf', 'medium'),
('Problem Solving & Data Analysis', 'Mean, median, mode, range, standard deviation', 'Understand central tendency and variability', 'pdf', 'medium'),
('Problem Solving & Data Analysis', 'Probability (basic and compound)', 'Calculate simple and compound probabilities', 'pdf', 'medium'),
('Problem Solving & Data Analysis', 'Interpreting tables, graphs, and data sets', 'Extract information from various data representations', 'pdf', 'medium'),
('Problem Solving & Data Analysis', 'Two-way tables and relative frequency', 'Analyze categorical data using two-way tables', 'pdf', 'medium'),
('Problem Solving & Data Analysis', 'Word problems involving proportional relationships', 'Solve real-world problems using proportions', 'pdf', 'hard');

-- Insert subtopics for Passport to Advanced Math
INSERT INTO sat_content (topic, title, description, content_type, difficulty_level) VALUES
('Passport to Advanced Math', 'Quadratic equations (factoring, quadratic formula)', 'Solve quadratics using multiple methods', 'pdf', 'medium'),
('Passport to Advanced Math', 'Nonlinear equations (higher-order polynomials)', 'Understand and solve polynomial equations', 'pdf', 'hard'),
('Passport to Advanced Math', 'Polynomial operations and roots', 'Perform operations and find roots of polynomials', 'pdf', 'medium'),
('Passport to Advanced Math', 'Rational expressions and equations', 'Simplify and solve rational expressions', 'pdf', 'hard'),
('Passport to Advanced Math', 'Radical expressions and equations', 'Work with radicals and solve radical equations', 'pdf', 'medium'),
('Passport to Advanced Math', 'Exponential functions (growth and decay)', 'Model exponential growth and decay', 'pdf', 'medium'),
('Passport to Advanced Math', 'Logarithms (basic properties)', 'Understand logarithmic functions and properties', 'pdf', 'hard'),
('Passport to Advanced Math', 'Function notation, composition, and transformations', 'Master function operations and transformations', 'pdf', 'hard'),
('Passport to Advanced Math', 'Solving equations involving absolute value', 'Solve absolute value equations and inequalities', 'pdf', 'medium'),
('Passport to Advanced Math', 'Systems involving quadratic and linear equations', 'Solve mixed systems with quadratics and lines', 'pdf', 'hard');

-- Insert subtopics for Additional Topics in Math
INSERT INTO sat_content (topic, title, description, content_type, difficulty_level) VALUES
('Additional Topics in Math', 'Lines, angles, and triangles', 'Understand basic geometric relationships', 'pdf', 'easy'),
('Additional Topics in Math', 'Special right triangles (30°–60°–90°, 45°–45°–90°)', 'Master special triangle properties', 'pdf', 'medium'),
('Additional Topics in Math', 'Circles (arc length, area sector, equations)', 'Work with circle properties and equations', 'pdf', 'medium'),
('Additional Topics in Math', 'Volume and surface area', 'Calculate volumes and surface areas of 3D shapes', 'pdf', 'medium'),
('Additional Topics in Math', 'Coordinate geometry', 'Apply geometry concepts in coordinate plane', 'pdf', 'medium'),
('Additional Topics in Math', 'Trigonometry (sine, cosine, tangent)', 'Understand basic trigonometric functions', 'pdf', 'medium'),
('Additional Topics in Math', 'Complex numbers (basic operations)', 'Perform basic operations with complex numbers', 'pdf', 'hard');

-- Insert subtopics for General Math Skills
INSERT INTO sat_content (topic, title, description, content_type, difficulty_level) VALUES
('General Math Skills', 'Translating word problems into equations', 'Convert word problems to mathematical equations', 'pdf', 'medium'),
('General Math Skills', 'Estimation and approximation', 'Use estimation techniques for quick solutions', 'pdf', 'easy'),
('General Math Skills', 'Analyzing solutions for reasonableness', 'Check if answers make sense in context', 'pdf', 'medium'),
('General Math Skills', 'Working without a calculator efficiently', 'Master mental math and non-calculator techniques', 'pdf', 'hard');
