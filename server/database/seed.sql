-- Sample data for Life in the UK test

-- Insert chapters
INSERT INTO chapters (title, description, content, order_index) VALUES
('The Values and Principles of the UK', 
 'Understanding British values, history, and traditions',
 '## British Values

The UK is founded on values of democracy, the rule of law, individual liberty, and mutual respect and tolerance of different faiths and beliefs.

### Democracy
The UK is a democracy, which means the people have a say in how they are governed. Citizens vote in elections to choose Members of Parliament (MPs) who represent them in the House of Commons.

### The Rule of Law
Everyone in the UK, including the government, must obey the law. Laws are made by Parliament and enforced by the police and courts.

### Individual Liberty
People in the UK have freedom of speech, freedom of religion, and other fundamental rights protected by law.

### Mutual Respect and Tolerance
British society values respect for others regardless of their background, religion, or beliefs. Discrimination is against the law.',
 1),

('A Long and Illustrious History',
 'Key events and figures in British history',
 '## Early Britain

### Prehistoric Britain
The first people came to Britain during the Stone Age. Stonehenge, built around 2500 BC, is one of the most famous prehistoric monuments.

### Roman Britain (43 AD - 410 AD)
The Romans invaded Britain in 43 AD under Emperor Claudius. They built roads, towns, and Hadrian''s Wall to protect the northern frontier.

### Anglo-Saxon England
After the Romans left, Anglo-Saxon tribes settled in Britain. They established kingdoms and brought Christianity to England.

### The Norman Conquest (1066)
William the Conqueror defeated King Harold at the Battle of Hastings. This marked the beginning of Norman rule in England.

## The Middle Ages

### Magna Carta (1215)
King John signed the Magna Carta, limiting the power of the monarch and establishing important legal principles.

### The Wars of the Roses (1455-1485)
A series of civil wars between the House of Lancaster and the House of York for control of the English throne.',
 2),

('A Modern, Thriving Society',
 'Contemporary Britain and its culture',
 '## The UK Today

The United Kingdom consists of England, Scotland, Wales, and Northern Ireland. The capital is London.

### Population and Diversity
The UK has a population of around 67 million people. It is a diverse society with people from many different backgrounds, cultures, and religions.

### The Economy
The UK has one of the largest economies in the world. Major industries include:
- Financial services
- Manufacturing
- Creative industries
- Technology and innovation

### Education
Education is free and compulsory for children aged 5 to 18. The UK has world-renowned universities including Oxford and Cambridge.

### Healthcare
The National Health Service (NHS) provides free healthcare to all UK residents. It was established in 1948.

### Sport and Leisure
Popular sports include football, rugby, cricket, and tennis. The UK has hosted the Olympic Games several times.',
 3),

('The UK Government and Law',
 'Understanding the British political system',
 '## The Political System

### Constitutional Monarchy
The UK is a constitutional monarchy with Queen Elizabeth II (now King Charles III) as the head of state. The monarch''s role is largely ceremonial.

### Parliament
Parliament makes laws and consists of:
- **The House of Commons** - elected MPs
- **The House of Lords** - appointed and hereditary members
- **The Monarch** - gives Royal Assent to laws

### The Prime Minister
The leader of the political party with the most MPs becomes Prime Minister. They form the government and appoint Cabinet ministers.

### Elections
General elections must be held at least every five years. Citizens aged 18 and over can vote.

### Devolution
Scotland, Wales, and Northern Ireland have their own governments with powers over certain areas like health and education.

## The Legal System

### Criminal Law
Criminal courts deal with crimes like theft, assault, and murder. The police investigate crimes and the Crown Prosecution Service prosecutes offenders.

### Civil Law
Civil courts deal with disputes between individuals or organizations, such as family matters, contracts, and property issues.',
 4);

-- Insert questions for Chapter 1
INSERT INTO questions (chapter_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(1, 'Which of the following is a fundamental principle of British life?',
 'The rule of law',
 'Compulsory voting',
 'Military service',
 'State religion',
 'A',
 'The rule of law is one of the fundamental principles of British life, meaning everyone must obey the law including the government.',
 'easy'),

(1, 'What does democracy mean in the UK?',
 'The monarch makes all decisions',
 'The people have a say in how they are governed',
 'Only wealthy people can vote',
 'Laws are made by judges',
 'B',
 'Democracy means that people have a say in how they are governed through voting in elections.',
 'easy'),

(1, 'Is discrimination against the law in the UK?',
 'Yes',
 'No',
 'Only in certain regions',
 'Only for citizens',
 'A',
 'Yes, discrimination is against the law in the UK. British society values mutual respect and tolerance.',
 'easy'),

-- Chapter 2 questions
(2, 'In which year did the Romans invade Britain?',
 '55 BC',
 '43 AD',
 '410 AD',
 '1066 AD',
 'B',
 'The Romans invaded Britain in 43 AD under Emperor Claudius.',
 'medium'),

(2, 'Who was defeated at the Battle of Hastings in 1066?',
 'William the Conqueror',
 'King Harold',
 'King John',
 'Richard the Lionheart',
 'B',
 'King Harold was defeated by William the Conqueror at the Battle of Hastings in 1066.',
 'medium'),

(2, 'What important document did King John sign in 1215?',
 'The Bill of Rights',
 'Magna Carta',
 'The Act of Union',
 'The Great Charter',
 'B',
 'King John signed the Magna Carta in 1215, which limited the power of the monarch.',
 'medium'),

(2, 'When was Stonehenge built?',
 'Around 500 BC',
 'Around 2500 BC',
 'Around 5000 BC',
 'Around 1000 AD',
 'B',
 'Stonehenge was built around 2500 BC and is one of the most famous prehistoric monuments.',
 'medium'),

-- Chapter 3 questions
(3, 'Which countries make up the United Kingdom?',
 'England, Scotland, Ireland, and Wales',
 'England, Scotland, Wales, and Northern Ireland',
 'England, Scotland, and Wales only',
 'England and Scotland only',
 'B',
 'The UK consists of England, Scotland, Wales, and Northern Ireland.',
 'easy'),

(3, 'What is the name of the UK healthcare system?',
 'National Health Service (NHS)',
 'British Health Service',
 'Royal Health Service',
 'United Health Service',
 'A',
 'The National Health Service (NHS) provides free healthcare to all UK residents.',
 'easy'),

(3, 'When was the NHS established?',
 '1918',
 '1945',
 '1948',
 '1952',
 'C',
 'The NHS was established in 1948 to provide free healthcare.',
 'medium'),

(3, 'What is the approximate population of the UK?',
 'Around 50 million',
 'Around 67 million',
 'Around 80 million',
 'Around 100 million',
 'B',
 'The UK has a population of around 67 million people.',
 'medium'),

-- Chapter 4 questions
(4, 'What type of political system does the UK have?',
 'Republic',
 'Constitutional monarchy',
 'Absolute monarchy',
 'Dictatorship',
 'B',
 'The UK is a constitutional monarchy where the monarch''s role is largely ceremonial.',
 'easy'),

(4, 'Which two houses make up Parliament?',
 'House of Commons and House of Lords',
 'House of Representatives and Senate',
 'Lower House and Upper House',
 'People''s House and Royal House',
 'A',
 'Parliament consists of the House of Commons and the House of Lords.',
 'easy'),

(4, 'How often must general elections be held?',
 'Every 3 years',
 'At least every 5 years',
 'Every 7 years',
 'Every 10 years',
 'B',
 'General elections must be held at least every five years.',
 'medium'),

(4, 'At what age can UK citizens vote?',
 '16 and over',
 '18 and over',
 '21 and over',
 '25 and over',
 'B',
 'UK citizens aged 18 and over can vote in elections.',
 'easy'),

(4, 'Who becomes Prime Minister?',
 'The monarch appoints them',
 'The leader of the party with the most MPs',
 'The oldest MP',
 'The person with the most votes',
 'B',
 'The leader of the political party with the most MPs becomes Prime Minister.',
 'medium'),

(4, 'Which regions have devolved governments?',
 'Only Scotland',
 'Scotland, Wales, and Northern Ireland',
 'All regions of the UK',
 'Only Wales and Northern Ireland',
 'B',
 'Scotland, Wales, and Northern Ireland have their own devolved governments.',
 'medium');
