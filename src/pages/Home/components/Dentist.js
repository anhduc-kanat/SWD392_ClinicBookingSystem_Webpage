import React from 'react';
import './Dentist.css'; // Import the CSS file for custom styles


const Dentist = () => {
    return (
        <div>
            <div className="dentist-container">
                <img src='/assets/Doc 1.png' alt="Dr Khoi" className="dentist-image" />
                <div className="dentist-info">
                    <span className="dentist-title">Branch manager 1 Tp.HCM.</span>
                    <h2>Dr Khoi</h2>
                    <p>
                        Dr. Khôi is a highly experienced dentist with a passion for transforming smiles and improving oral health.
                        With years of dedicated practice in the field of dentistry, Dr. Khôi has honed his skills in a wide range of
                        dental services, including check-ups, fillings, cosmetic dentistry, and more. Known for his gentle and
                        compassionate approach, Dr. Khôi strives to provide personalized care to each of his patients, ensuring they
                        feel comfortable and confident throughout their dental journey.
                    </p>
                </div>
            </div>
            <div className="dentist-container">
                <img src='/assets/Doc 2.png' alt="Dr Khoi" className="dentist-image" />
                <div className="dentist-info">
                    <span className="dentist-title">Branch manager 1 Tp.HCM.</span>
                    <h2>Dr Duc</h2>
                    <p>
                    Dr. Duc is a compassionate dentist dedicated to providing exceptional dental care. With a focus on preventive and restorative treatments, he ensures each patient receives personalized attention and top-quality care. Dr. Duc's gentle approach and commitment to staying updated with the latest advancements in dentistry make him a trusted choice for achieving healthy, beautiful smiles.
                    </p>
                </div>
            </div>

        </div>


    );
};

export default Dentist;
