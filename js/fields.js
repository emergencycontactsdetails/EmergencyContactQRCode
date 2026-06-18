export const FIELD_SECTIONS = [
  {
    id: 'item',
    title: '📌 Item / Category Details',
    fields: [
      { id: 'cat', label: 'Category', type: 'select', icon: '📦',
        options: ['Mobile','Bag','Bike','Laptop','Wallet','ID Card','Pet','Keys','Book','Other'] },
      { id: 'desc', label: 'Short Description', type: 'text', placeholder: 'Black iPhone 15 Pro' },
      { id: 'color', label: 'Item Color', type: 'text', placeholder: 'Midnight Blue' },
      { id: 'marks', label: 'Unique Marks / Notes', type: 'textarea', placeholder: 'Sticker on back cover' },
    ]
  },
  {
    id: 'owner',
    title: '👤 Owner Info',
    fields: [
      { id: 'oType', label: 'Owner Type', type: 'select', options: ['Student','Staff','Parent'] },
      { id: 'school', label: 'School / Cottage Name', type: 'text', placeholder: 'Green Valley School' },
      { id: 'class', label: 'Class / Room No.', type: 'text', placeholder: 'Grade 8 / Room 12B' },
      { id: 'photo', label: 'Profile Photo', type: 'file', accept: 'image/*', sensitive: true },
    ]
  },
  {
    id: 'contact',
    title: '📞 Extra Contact Methods',
    fields: [
      { id: 'ec2Name', label: 'Secondary Contact Name', type: 'text', placeholder: 'Father' },
      { id: 'ec2Phone', label: 'Secondary Contact Phone', type: 'tel', placeholder: '+91 9876543210' },
      { id: 'email', label: 'Email Address', type: 'email', placeholder: 'name@example.com' },
      { id: 'wa', label: 'WhatsApp Number', type: 'tel', placeholder: '+91 9876543210' },
      { id: 'land', label: 'Landline / Office', type: 'tel', placeholder: '080-12345678' },
    ]
  },
  {
    id: 'social',
    title: '🌐 Social Media',
    fields: [
      { id: 'ig', label: 'Instagram',   type: 'text', icon: '📷', placeholder: 'Just username — e.g., boopathiskv' },
      { id: 'fb', label: 'Facebook',    type: 'text', icon: '👥', placeholder: 'Just username — e.g., boopathi.s' },
      { id: 'li', label: 'LinkedIn',    type: 'text', icon: '💼', placeholder: 'Just username — e.g., boopathiskv' },
      { id: 'tw', label: 'Twitter / X', type: 'text', icon: '🐦', placeholder: 'Just username — e.g., boopathiskv' },
      { id: 'yt', label: 'YouTube',     type: 'text', icon: '📺', placeholder: 'Just handle — e.g., boopathiskv' },
      { id: 'web', label: 'Website',    type: 'text', icon: '🌐', placeholder: 'e.g., boopathi.dev or https://boopathi.dev' },
    ]
  },
  {
    id: 'medical',
    title: '🩺 Medical Info',
    sensitive: true,
    fields: [
      { id: 'blood', label: 'Blood Group', type: 'select',
        options: ['A+','A-','B+','B-','AB+','AB-','O+','O-'] },
      { id: 'allergy', label: 'Allergies', type: 'text', placeholder: 'Peanuts, Dust' },
      { id: 'cond', label: 'Medical Conditions', type: 'text', placeholder: 'Asthma' },
      { id: 'meds', label: 'Current Medications', type: 'text', placeholder: 'Inhaler' },
      { id: 'doc', label: "Doctor's Contact", type: 'tel', placeholder: '+91 9876543210' },
    ]
  },
  {
    id: 'extra',
    title: '🎁 Extra Info',
    fields: [
      { id: 'reward', label: 'Reward Message', type: 'text', placeholder: '₹500 reward if returned' },
      { id: 'return', label: 'Return Address Hint', type: 'text', placeholder: 'Drop at school reception' },
      { id: 'msg', label: 'Custom Message', type: 'textarea', placeholder: 'Thank you for your kindness!' },
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