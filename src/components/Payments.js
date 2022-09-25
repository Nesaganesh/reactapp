// import {Elements} from '@stripe/react-stripe-js';
// import {loadStripe} from '@stripe/stripe-js';
// import {PaymentElement} from '@stripe/react-stripe-js';

// // Make sure to call `loadStripe` outside of a component’s render to avoid
// // recreating the `Stripe` object on every render.
// const stripePromise = loadStripe('pk_live_51LlLRyLGvjVK7osz8i5JUHIByaA2Yed4cxMTMkL6oiZLTtFYn7SHy0NuSSuXd8OD5OhUESTqee1f2E2mx1IfbwbD00DyF2roed');

// function Payments() {
//   const options = {
//     // passing the client secret obtained from the server
//     clientSecret: '{{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}}'
//   };

//   return (
//       <>
//         <Elements stripe={stripePromise} options={options}>
//             <form>
//                 <PaymentElement />
//                 <button>Submit</button>
//             </form>
//         </Elements>
//     </>
//   );
// };

// export default Payments;