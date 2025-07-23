export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const ContactMessage = IDL.Record({
    'subject' : IDL.Text,
    'name' : IDL.Text,
    'email' : IDL.Text,
    'message' : IDL.Text,
    'timestamp' : Time,
  });
  const LawsuitInterest = IDL.Record({
    'additionalInfo' : IDL.Text,
    'name' : IDL.Text,
    'propertyAddress' : IDL.Text,
    'email' : IDL.Text,
    'propertyDetails' : IDL.Text,
    'timestamp' : Time,
    'phone' : IDL.Text,
  });
  return IDL.Service({
    'getContactMessages' : IDL.Func([], [IDL.Vec(ContactMessage)], ['query']),
    'getLawsuitInterests' : IDL.Func([], [IDL.Vec(LawsuitInterest)], ['query']),
    'submitContactMessage' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [],
        [],
      ),
    'submitLawsuitInterest' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };