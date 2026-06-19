import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StyledEngineProvider } from '@mui/material/styles'
import GlobalStyles from '@mui/material/GlobalStyles'
import { BrowserRouter } from 'react-router'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/es-mx'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import updateLocale from "dayjs/plugin/updateLocale";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
//update comment
dayjs.extend(localizedFormat);
dayjs.extend(updateLocale);
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.locale('es-mx');
dayjs.updateLocale("es-mx", {
  weekStart: 1,
});
dayjs.tz.setDefault("America/Lima")

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyledEngineProvider enableCssLayer>
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es-mx'>
          <App />
        </LocalizationProvider>
      </BrowserRouter>
    </StyledEngineProvider>
  </StrictMode>,
)
