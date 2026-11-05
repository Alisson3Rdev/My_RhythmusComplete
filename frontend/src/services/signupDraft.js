let draft = {};

export function setSignupDraft(values) {
  draft = { ...draft, ...values };
}

export function getSignupDraft() {
  return { ...draft };
}

export function clearSignupDraft() {
  draft = {};
}
