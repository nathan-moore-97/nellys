function AddressView() {
    return (
        <>
        <div className="mb-4">
            <address>
                <strong className="h5">
                    9000 Richmond Hwy<br />
                    Alexandria, VA<br />
                    22309
                </strong>
            </address>
            
            <div className="mt-3">
                <p>
                    <a href="tel:1-703-780-4000" className="text-decoration-none">(703) 780-4000</a><br />
                    <a href="mailto:nellysneedlers@gmail.com" className="text-decoration-none">nellysneedlers@gmail.com</a>
                </p>
            </div>
        </div>
        </>
    );
}

export default AddressView;