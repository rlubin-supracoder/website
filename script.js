
document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('supportForm');
const note = document.getElementById('formNote');

if (form) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name')?.value.trim() || '';
    const email = document.getElementById('email')?.value.trim() || '';
    const app = document.getElementById('app')?.value.trim() || '';
    const message = document.getElementById('message')?.value.trim() || '';

    const subject = encodeURIComponent('Support Request');
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nApp: ${app}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:support@russelllubinski.us?subject=${subject}&body=${body}`;

    if (note) {
      note.textContent = 'Your email app should open with a drafted support message.';
    }
  });
}
