import nodemailer from 'nodemailer';

export const sendEmail = async(email, first_name, last_name, code) =>{
    try {
        const smtpEndpoint = 'smtp.mailtrap.io';
        const PORT = 2525;
        const senderAddress =  '"Pradeep Bhosle" pradeep.bhosle8@gmail.com';
        var toAddress = email;
        const smtpUsername  = '114009a67ae007';
        const smtpPassword = 'f009f4c0ee8e41'
        var Subject = 'Verify your email';
        
         // The body of the email for recipients
        var body_html = `<!DOCTYPE> 
        <html>
        <body>
        <table width="100%" cellpadding="0" cellspacing="0">
    <tbody>
      <tr>
        <td width="100%">
          <div style="max-width:600px;Margin:0 auto">
            <table
            
              cellpadding="0"
              cellspacing="0"
              style="border-spacing:0;font-family:gt-eesti,ArialMT,Helvetica,Arial,sans-serif;Margin:0 auto;padding:24px;width:100%;max-width:500px"
            >
              <tbody>
                <tr>
                  <td>
                    <table style="margin-bottom:40px;width:100%" width="100%">
                      <tbody>
                        <tr>
                          <td>
                            <a
                              href=""
                              style="font-family:Helvetica,Arial,sans-serif;color:#0086bf"
                              target="_blank"
                            >
                              <img
                                src="https://cdn.pixabay.com/photo/2017/01/31/23/42/animal-2028258_960_720.png"
                                style="display:block"
                                alt="8link"
                                width="200"
                                height="65"
                              />
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="text-align:justify;word-break:break-word">
                    <table style="margin-bottom:20px;width:100%" width="100%">
                      <tbody>
                        <tr>
                          <td>
                            <table
                              style="width:100%;margin-bottom:20px"
                              width="100%"
                              cellpadding="0"
                              cellspacing="0"
                            >
                              <tbody>
                                <tr>
                                  <td>
                                    <strong style="font-family:Helvetica,Arial,sans-serif;color:#234567">Hi, ${first_name} ${last_name}, </strong>
                                    
                                    <h1
                                      style="font-size:26px;line-height:30px;color:#054752;word-break:normal"
                                    >
                                    
                                    Welcome to PradeepBhosletech.com Please confirm your email.
                                    </h1>
                                    <p>Your authentication code is : </p> <b>${code}</b>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
  
                        <tr>
                          <td>
                           
                              <table
                                style="background-color:#fff;margin-bottom:20px;table-layout:fixed"
                               
                                width=""
                                cellspacing="0"
                                cellpadding="0"
                              >
                                <tbody>
                                  <tr>
                                    <td
                                      style="background-color:#00aff5;color:#fff;text-align:center;border-radius:48px;padding:16px 24px;border-color:transparent;font-weight:bold;font-size:16px;line-height:1"
                                    >
                                      <a style="color: white; text-decoration: none;"> Confirm Email </a>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                         
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" style="margin-bottom:20px;width:100%">
                      <tbody>
                        <tr>
                          <td width="100%">
                            <div
                              style="width:100%;height:1px;background-color:#ddd"
                              color="#DDD"
                              width="100%"
                            ></div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
  
                <tr>
                  <td style="text-align:center">
                    <img
                      src="https://cdn.pixabay.com/photo/2017/01/31/23/42/animal-2028258_960_720.png"
                      alt="8link_icon"
                      style="display:block;width:29px;height:auto;margin-left:auto;margin-right:auto;margin-bottom:10px"
                      height="auto"
                    />
                  </td>
                </tr>
                <tr>
                  <td style="text-align:center;font-size:13px">
                    <a
                      href=""
                      style="color:#00aff5"
                      target="_blank"
                    >
                      Goto 8link.in
                    </a>
                    <span style="color:#00aff5">|</span>
                    <a
                      href=""
                      style="color:#00aff5"
                      target="_blank"
                    >
                      FAQ
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="text-align:center">
                    <table
                      style="max-width:100%;width:100%;text-align:center;font-family:ArialMT,Arial,sans-serif"
                      cellspacing="0"
                      cellpadding="0"
                    >
                      <tbody>
                        <tr>
                          <td style="text-align:center">
                            <p
                              style="font-size:10px;color:#708c91;text-align:center;padding:0;margin-top:10px;margin-bottom:2px"
                            >
                              This email was sent to you by
                              pradeep@8.in (Do not reply)
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
            
        </body>
        </html>`;

         // Create the SMTP transport.
        let transporter = nodemailer.createTransport({
            host: smtpEndpoint,
            port: PORT,
            auth: {
            user: smtpUsername,
            pass: smtpPassword,
            },
        });

        // checking connection

        transporter.verify((error, success)=>{
            if(error){
                console.log("Error Mail Server" + error);
            }else{
                console.log('Mail Server Is Running...')    
            }
        })

          // Specify the fields in the email.
        let mailOptions = {
            from: senderAddress,
            to: toAddress,
            subject: Subject,
            html: body_html,
        };

        let info = await transporter.sendMail(mailOptions); 
        return { error: false };


    } catch (error) {
        console.error("send-email-error", error);
        return {
          error: true,
          message: "Cannot send email",
        };
    }
}