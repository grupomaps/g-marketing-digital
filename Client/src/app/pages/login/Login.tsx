import { useState, FormEvent, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import '../login/components/login.css';
import './Login.css';
import { PasswordInput } from './components/passwordInput';
import { EmailInput } from './components/emailinput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

export const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const [recuperar, setRecuperar] = useState<boolean>(false);
    const [recuperarEmail, setRecuperarEmail] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [resetSuccess, setResetSuccess] = useState<string>('');
    const [showCircles, setShowCircles] = useState<boolean>(false);
    const circlesRef = useRef<HTMLDivElement[]>([]);
    const navigate = useNavigate();

    const recuperador_senha = () => {
        setRecuperar(!recuperar);
        setError('');
    };

    const handleLogin = async (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, senha);
            console.log("Login bem-sucedido");
            navigate('/setores');
        } catch (erro) {
            console.log(erro);
            setError('Ocorreu um erro ao fazer login.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async () => {
        setError('');
        setResetSuccess('');

        if (!recuperarEmail) {
            setError('Por favor, insira o seu email.');
            return;
        }

        if (!recuperarEmail.endsWith('@grupomapscartaodigital.com.br')) {
            setError('Apenas emails com o domínio @grupomapscartaodigital.com.br podem receber a recuperação de senha.');
            return;
        }

        try {
            await sendPasswordResetEmail(auth, recuperarEmail);
            setResetSuccess('Um email de recuperação foi enviado.');
        } catch (erro) {
            console.log(erro);
            setError('Erro ao enviar email de recuperação.');
        }
    };

    const handleInputChange = () => {
        setError('');
    };

  

    useEffect(() => {
        const circles = circlesRef.current;

        const handleMouseEnter = (circle: HTMLDivElement) => {
            circle.classList.remove('surging');
        };

        const handleMouseLeave = (circle: HTMLDivElement) => {
            circle.classList.add('surging');
        };

        circles.forEach(circle => {
            circle.addEventListener('mouseenter', () => handleMouseEnter(circle));
            circle.addEventListener('mouseleave', () => handleMouseLeave(circle));
        });

        return () => {
            circles.forEach(circle => {
                circle.removeEventListener('mouseenter', () => handleMouseEnter(circle));
                circle.removeEventListener('mouseleave', () => handleMouseLeave(circle));
            });
        };
    }, []);

    useEffect(() => {
        if (recuperar) {
            setShowCircles(true);
        }
    }, [recuperar]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleLogin(e as unknown as FormEvent<HTMLButtonElement>);
        }
    };
    return (
        <section>
        <div className="cx-decoration"><svg className="cx-decoration__lines cx-decoration__top-left-lines"
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 388 727" data-t="lines-svg" aria-labelledby="lines-svg"
            role="img">
            <title id="lines-svg"></title>
            <path
                d="M168.269 66.4821L268.943 1.5908L268.401 0.750275L166.986 66.1194L1.1366 19.0246L0.863435 19.9866L165.874 66.8429L71.2691 127.822L0.729147 173.285L1.27088 174.126L95.4719 113.414L167.155 67.2068L291.724 102.579L143.515 419.707L1.41119 214.332L0.588844 214.901L143.025 420.756L0.546997 725.788L1.45303 726.212L143.684 421.711L223.665 537.305L224.487 536.736L144.175 420.662L292.701 102.855L386.952 129.618L387.226 128.656L293.131 101.937L340.122 1.38222L339.217 0.958847L292.156 101.66L168.269 66.4821Z">
            </path>
        </svg><svg className="cx-decoration__lines cx-decoration__top-right-lines" xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 457 163" data-t="lines-svg" aria-labelledby="lines-svg" role="img">
            <title id="lines-svg"></title>
            <path d="M456.334 162.725L0.333679 1.85438L0.66637 0.911346L456.666 161.782L456.334 162.725Z"></path>
        </svg><svg className="cx-decoration__lines cx-decoration__bottom-left-lines" xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 205 92" data-t="lines-svg" aria-labelledby="lines-svg" role="img">
            <title id="lines-svg"></title>
            <path
                d="M1.0608 0.0432434L89.5033 39.4213L126.086 55.7013L125.68 56.6149L89.0967 40.3349L0.654053 0.956785L1.0608 0.0432434ZM133.478 58.9914L134.904 59.6264L204.699 90.5414L204.702 90.5429L204.301 91.4586L204.298 91.4572L189.498 85.0306L189.494 85.0288L134.501 60.5418L133.007 59.8799L133.478 58.9914Z">
            </path>
        </svg><svg className="cx-decoration__lines cx-decoration__bottom-right-lines" xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 814 424" data-t="lines-svg" aria-labelledby="lines-svg" role="img">
            <title id="lines-svg"></title>
            <path
                d="M555.302 -0.000961304L813.364 273.714L812.636 274.4L554.574 0.685034L555.302 -0.000961304ZM0.224352 237.744L326.769 280.873L279.047 245.432L279.643 244.63L328.809 281.142L813.066 345.104L812.935 346.095L330.464 282.37L519.798 422.972L519.202 423.775L328.424 282.101L0.0934143 238.736L0.224352 237.744Z">
            </path>
        </svg>
    </div>
        <div className='Home'>
            <div className="container">
                <div className={`box-login ${recuperar ? 'hidden' : ''}`}>
                    <div className="title-box">
                        <h1 className="text-center mt-2">Login</h1>
                    </div>
                    <div className="text-center inputs-login">
                        <EmailInput
                            id="emailField"
                            className="form-control"
                            placeholder="Digite o seu email"
                            value={email}
                            
                            onChange={(e) => {
                                setEmail(e.target.value);
                                handleInputChange();
                             }}
                            onKeyDown={handleKeyDown}
                        />
                        <PasswordInput
                            id="passwordField"
                            className="form-control"
                            placeholder="Insira sua senha"
                            value={senha}
                            onChange={(e) => {
                                setSenha(e.target.value);
                                handleInputChange();
                            }}
                            onKeyDown={handleKeyDown}
                        />
                        <button onClick={handleLogin} className="btn btn-login mt-4" disabled={loading}>
                            {loading ? 'Carregando...' : 'Login'}
                        </button>
                        {error && <div className="alert alert-danger mt-3">{error}</div>}
                    </div>
                    <div className="text-center recuperar-senha">
                        <small>Esqueceu a senha?
                            <Link to={''} onClick={recuperador_senha} className={recuperar ? 'fazer-login' : 'recuperar-senha'}>
                                {recuperar ? 'Fazer Login' : ' Recuperar Senha'}
                            </Link>
                        </small>
                    </div>
                </div>
            </div>

            {recuperar && (
                <div className="overlay">
                    {showCircles && Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className={`circle ${showCircles ? 'surging' : ''}`} ref={(el) => el && (circlesRef.current[index] = el)}></div>
                    ))}

                    <div className="recuperar-senha-content text-center">
                        <h2>Recuperar Senha</h2>
                        <input
                            type="email"
                            placeholder='Digite seu email'
                            className='form-control'
                            value={recuperarEmail}
                            onChange={(e) => {
                                setRecuperarEmail(e.target.value);
                                setError('');
                            }}
                            
                        />
                        <div className="btnsubmit">
                            <button onClick={handlePasswordReset} className="btn btn-recuperar btn-success mt-3">Enviar</button>
                            <button onClick={() => setRecuperar(false)} className="btn btn-fechar btn-danger mt-3">
                                <FontAwesomeIcon icon={faClose} />
                            </button>
                        </div>
                        {error && <div className="alert alert-danger mt-3">{error}</div>}
                        {resetSuccess && <div className="alert alert-success mt-3">{resetSuccess}</div>}
                    </div>
                </div>
            )}
        </div>
        </section>
    );
};
