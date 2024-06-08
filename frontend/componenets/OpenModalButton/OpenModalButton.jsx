import { useModal } from '../../src/Context/Modal';
import { useNavigate } from 'react-router-dom';

function OpenModalButton({
  modalComponent, // component to render inside the modal
  buttonText, // text of the button that opens the modal
  onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose, // optional: callback function that will be called once the modal is closed
  // routeToNavigateYes, // optional: route to navigate to when the button is clicked
  // routeToNavigateNo, // optional: route to navigate to when the button is clicked

}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onButtonClick === "function") onButtonClick();
    // if ( routeToNavigateYes) navigate( routeToNavigateYes); // Navigate to the specified route

  };

  return <button onClick={onClick}>{buttonText}</button>;
}

export default OpenModalButton;
