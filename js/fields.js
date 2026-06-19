const MAX_Color = 20;
const MAX_NAME = 50;
const MAX_TEXT = 50;
const MAX_PHONE = 16;
const MAX_EMAIL = 50;
const MAX_TEXTAREA = 100;

export const FIELD_SECTIONS = [
  {
    id: 'item',
    title: '📌 Item / Category Details',
    fields: [
      { id: 'cat', label: 'Category', type: 'select', icon: '📦',
        options: ['Mobile','Bag','Bike','Laptop','Wallet','ID Card','Pet','Keys','Book','Other'] },
      { id: 'desc', label: 'Short Description', type: 'text', placeholder: 'Black iPhone 15 Pro',maxLength: MAX_TEXT },
      { id: 'color', label: 'Item Color', type: 'text', placeholder: 'Midnight Blue',maxLength: MAX_Color },
      { id: 'marks', label: 'Unique Marks / Notes', type: 'textarea', placeholder: 'Sticker on back cover',maxLength: MAX_TEXTAREA  },
    ]
  },
  {
    id: 'owner',
    title: '👤 Owner Info',
    fields: [
      { id: 'oType', label: 'Owner Type', type: 'select', options: ['Student','Staff','Parent'] },
      { id: 'school', label: 'School / Cottage Name', type: 'text', placeholder: 'Green Valley School',maxLength:MAX_TEXT },
      { id: 'class', label: 'Class / Room No.', type: 'text', placeholder: 'Grade 8 / Room 12B',maxLength:MAX_TEXT },
      { id: 'photo', label: 'Profile Photo', type: 'file', accept: 'image/*', sensitive: true },
    ]
  },
  {
    id: 'contact',
    title: '📞 Extra Contact Methods',
    fields: [
      { id: 'ec2Name', label: 'Secondary Contact Name', type: 'text', placeholder: 'Father',maxLength:MAX_NAME },
      { id: 'ec2Phone', label: 'Secondary Contact Phone', type: 'tel', placeholder: '+91 9876543210',maxLength:MAX_PHONE },
      { id: 'email', label: 'Email Address', type: 'email', placeholder: 'name@example.com',maxLength:MAX_EMAIL },
      { id: 'wa', label: 'WhatsApp Number', type: 'tel', placeholder: '+91 9876543210',maxLength:MAX_PHONE },
      { id: 'land', label: 'Landline / Office', type: 'tel', placeholder: '080-12345678',maxLength:MAX_PHONE },
    ]
  },
  {
    id: 'social',
    title: '🌐 Social Media',
    fields: [
      { id: 'ig', label: 'Instagram',   type: 'text', icon: '📷', placeholder: 'Just username — e.g., boopathiskv',maxLength:MAX_NAME },
      { id: 'fb', label: 'Facebook',    type: 'text', icon: '👥', placeholder: 'Just username — e.g., boopathi.s',maxLength:MAX_NAME },
      { id: 'li', label: 'LinkedIn',    type: 'text', icon: '💼', placeholder: 'Just username — e.g., boopathiskv',maxLength:MAX_NAME },
      { id: 'tw', label: 'Twitter / X', type: 'text', icon: '🐦', placeholder: 'Just username — e.g., boopathiskv',maxLength:MAX_NAME },
      { id: 'yt', label: 'YouTube',     type: 'text', icon: '📺', placeholder: 'Just handle — e.g., boopathiskv',maxLength:MAX_NAME },
      { id: 'web', label: 'Website',    type: 'text', icon: '🌐', placeholder: 'e.g., boopathi.dev or https://boopathi.dev',maxLength:MAX_NAME },
    ]
  },
  {
    id: 'medical',
    title: '🩺 Medical Info',
    sensitive: true,
    fields: [
      { id: 'blood', label: 'Blood Group', type: 'select',
        options: ['A+','A-','B+','B-','AB+','AB-','O+','O-'] },
      { id: 'allergy', label: 'Allergies', type: 'text', placeholder: 'Peanuts, Dust',maxLength:MAX_TEXT },
      { id: 'cond', label: 'Medical Conditions', type: 'text', placeholder: 'Asthma',maxLength:MAX_TEXT },
      { id: 'meds', label: 'Current Medications', type: 'text', placeholder: 'Inhaler',maxLength:MAX_TEXT },
      { id: 'doc', label: "Doctor's Contact", type: 'tel', placeholder: '+91 9876543210',maxLength:MAX_PHONE },
    ]
  },
  {
    id: 'extra',
    title: '🎁 Extra Info',
    fields: [
      { id: 'reward', label: 'Reward Message', type: 'text', placeholder: '₹500 reward if returned',maxLength:MAX_TEXT },
      { id: 'return', label: 'Return Address Hint', type: 'text', placeholder: 'Drop at school reception',maxLength:MAX_TEXT },
      { id: 'msg', label: 'Custom Message', type: 'textarea', placeholder: 'Thank you for your kindness!',maxLength:MAX_TEXTAREA },
    ]
  }
];

export const VIEW_LABELS = {
  cat: { label: 'Category', icon: '📦' },
  desc: { label: 'Description', icon: '📝' },
  color: { label: 'Color', icon: '🎨' },
  marks: { label: 'Notes', icon: '🔖' },
  oType: { label: 'Owner Type', icon: '👤' },
  school: { label: 'School', icon: '🏫' },
  class: { label: 'Class', icon: '📚' },
  ec2: { label: 'Secondary Contact', icon: '📞' },
  email: { label: 'Email', icon: '📧' },
  wa: { label: 'WhatsApp', icon: '💬' },
  land: { label: 'Landline', icon: '☎️' },
  ig: { label: 'Instagram', icon: '📷' },
  fb: { label: 'Facebook', icon: '👥' },
  li: { label: 'LinkedIn', icon: '💼' },
  tw: { label: 'Twitter', icon: '🐦' },
  yt: { label: 'YouTube', icon: '📺' },
  web: { label: 'Website', icon: '🌐' },
  blood: { label: 'Blood Group', icon: '🩸' },
  allergy: { label: 'Allergies', icon: '⚠️' },
  cond: { label: 'Conditions', icon: '🏥' },
  meds: { label: 'Medications', icon: '💊' },
  doc: { label: "Doctor's Contact", icon: '👨‍⚕️' },
  reward: { label: 'Reward', icon: '🎁' },
  return: { label: 'Return Hint', icon: '📍' },
  msg: { label: 'Message', icon: '💌' },
};

export const CATEGORY_ICONS = {
  Mobile: '📱', Bag: '🎒', Bike: '🚲', Laptop: '💻',
  Wallet: '👛', 'ID Card': '🪪', Pet: '🐕', Keys: '🔑',
  Book: '📖', Other: '📦'
};
