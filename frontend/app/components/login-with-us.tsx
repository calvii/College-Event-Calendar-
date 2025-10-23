"use client"
import styled from "styled-components"

// --- Styled components ---
const COLORS = {
  red: "#D12F2F",
  offWhite: "#F4F1ED",
  text: "#222222",
  line: "#E5E4E2",
  mutedBtn: "#BFBFBF",
}

const Section = styled.section`
  width: 100%;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  background: ${COLORS.red};
  color: white;

  @media (min-width: 960px) {
    grid-template-columns: 1fr 1fr;
  }
`

const Left = styled.div`
  position: relative;
  padding: 2rem clamp(1rem, 4vw, 3rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  overflow: hidden;
`

const LeftHeading = styled.h1`
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  font-size: clamp(2rem, 4vw, 2.75rem);
  margin: 0 0 0.25rem;
  text-transform: lowercase;
`

const LeftSub = styled.p`
  max-width: 36ch;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-size: clamp(1rem, 1.4vw, 1.125rem);
  margin: 0;
  color: rgba(255, 255, 255, 0.92);
`

const IllustrationWrap = styled.div`
  position: absolute;
  inset-inline-start: clamp(0.5rem, 2vw, 1rem);
  inset-block-end: clamp(0.5rem, 2vw, 1rem);
  width: min(360px, 42vw);
  pointer-events: none;
  user-select: none;

  img {
    width: 100%;
    height: auto;
    display: block;
  }
`

const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 4vw, 3rem);
`

const Card = styled.div`
  width: 100%;
  max-width: 620px;
  background: ${COLORS.offWhite};
  color: ${COLORS.text};
  border-radius: 18px;
  padding: clamp(1rem, 4vw, 2rem) clamp(1rem, 4vw, 2.25rem);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.02), 0 10px 30px rgba(0, 0, 0, 0.08);
`

const CardTitle = styled.h2`
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.2;
  font-size: clamp(1.5rem, 2.4vw, 1.75rem);
  margin: 0 0 1.5rem;
`

const Form = styled.form`
  display: grid;
  gap: 1rem;
`

const RowTwo = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: 1fr;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`

const Field = styled.label`
  display: grid;
  gap: 0.4rem;
  font-size: 0.875rem;
  color: #4a4a4a;
`

const Input = styled.input`
  border: 1px solid ${COLORS.line};
  background: white;
  border-radius: 10px;
  height: 42px;
  padding: 0 0.875rem;
  font-size: 0.95rem;
  color: ${COLORS.text};
  outline: none;

  &:focus {
    border-color: #c8c6c4;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.04);
  }
`

const RadioFieldset = styled.fieldset`
  border: 0;
  padding: 0.25rem 0 0;
  margin: 0.25rem 0 0.5rem;
`

const RadioLegend = styled.legend`
  font-size: 0.875rem;
  color: #4a4a4a;
  margin-bottom: 0.5rem;
`

const RadioRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`

const RadioLabel = styled.label`
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.95rem;

  input[type='radio'] {
    accent-color: ${COLORS.red};
    width: 16px;
    height: 16px;
  }
`

const Explainer = styled.p`
  margin: 0.5rem 0 1rem;
  color: #666666;
  line-height: 1.6;
  font-size: 0.95rem;
`

const Button = styled.button`
  width: fit-content;
  background: ${COLORS.mutedBtn};
  color: white;
  border: none;
  border-radius: 999px;
  height: 44px;
  padding: 0 1.25rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: filter 120ms ease;

  &:hover {
    filter: brightness(0.97);
  }

  &:active {
    filter: brightness(0.94);
  }
`

// --- Component ---
export default function LoginWithUs({ onLogin }: { onLogin?: (role: "admin" | "student") => void }) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const roleInput = form.elements.namedItem("role") as RadioNodeList
    const selectedRole = (roleInput.value as "admin" | "student") || "student"
    onLogin?.(selectedRole)
  }

  return (
    <Section aria-label="Login with us split layout">
      <Left>
        <LeftHeading>login with us.</LeftHeading>
        <LeftSub>Stay updated with upcoming workshops, fests, and important dates.</LeftSub>

        <IllustrationWrap aria-hidden="true">
          <img src="/images/abstract-illustration.png" alt="" />
        </IllustrationWrap>
      </Left>

      <Right>
        <Card role="region" aria-label="Sign up card">
          <CardTitle>Sign up now.</CardTitle>

          <Form onSubmit={handleSubmit}>
            <RowTwo>
              <Field>
                <span>First name</span>
                <Input type="text" name="firstName" placeholder="First name" autoComplete="given-name" required />
              </Field>

              <Field>
                <span>Last name</span>
                <Input type="text" name="lastName" placeholder="Last name" autoComplete="family-name" required />
              </Field>
            </RowTwo>

            <Field>
              <span>Email address</span>
              <Input type="email" name="email" placeholder="Email address" autoComplete="email" required />
            </Field>

            <RadioFieldset>
              <RadioLegend>Tell us who you are</RadioLegend>
              <RadioRow role="radiogroup" aria-label="Role selection">
                <RadioLabel>
                  <input type="radio" name="role" value="student" defaultChecked />
                  Student
                </RadioLabel>
                <RadioLabel>
                  <input type="radio" name="role" value="admin" />
                  Admin
                </RadioLabel>
              </RadioRow>
            </RadioFieldset>

            <Explainer>
              Logging in gives you access to the latest college events, workshops, seminars, and cultural activities—all
              in one place. Stay updated with real-time announcements, track upcoming schedules, and never miss an
              opportunity to participate. The calendar is designed to keep you connected with the heartbeat of campus
              life, so login now and make the most of every event!
            </Explainer>

            <Button type="submit">Sign up</Button>
          </Form>
        </Card>
      </Right>
    </Section>
  )
}
