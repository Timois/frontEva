
import { createRoot } from 'react-dom/client'
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Incluye todos los componentes JS de Bootstrap

import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { UnitProvider } from './context/UnitProvider.jsx'
import { UserProvider } from './context/UserProvider.jsx'
import { CareerProvider } from './context/CareerProvider.jsx'
import { GestionProvider } from './context/GestionProvider.jsx'
import { PeriodProvider } from './context/PeriodProvider.jsx'
import { ExtensionGestionProvider } from './context/ExtensionGestionProvider.jsx'
import { CareerAssignProvider } from './context/CareerAssignProvider.jsx';
import { ImportExcelQuestionsProvider } from './context/ImportExcelQuestionsProvider.jsx';
import { AreaProvider } from './context/AreaProvider.jsx';
import { QuestionsProvider } from './context/QuestionsProvider.jsx';
import { AnswersProvider } from './context/AnswersProvider.jsx';
import { PersonaProvider } from './context/PersonaProvider.jsx';
import { StudentProvider } from './context/StudentProvider.jsx';
import { PermissionsProvider } from './context/PermissionsProvider.jsx';
import { RolesProvider } from './context/RolesProvider.jsx';
import { ExamnsProvider } from './context/ExamnsProvider.jsx';
import { QuestionEvaluationProvider } from './context/QuestionEvaluationProvider.jsx';
import { GroupsProvider } from './context/GroupsProvider.jsx';
import { LabsProvider } from './context/LabsProvider.jsx';


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <PermissionsProvider>
      <RolesProvider>
        <UserProvider>
          <UnitProvider>
            <PersonaProvider>
              <CareerProvider>
                <GestionProvider>
                  <PeriodProvider>
                    <ExtensionGestionProvider>
                      <CareerAssignProvider>
                        <AreaProvider>
                          <ImportExcelQuestionsProvider>
                            <QuestionsProvider>
                              <AnswersProvider>
                                <ExamnsProvider>
                                  <StudentProvider>
                                    <LabsProvider>
                                      <GroupsProvider>
                                        <QuestionEvaluationProvider>
                                          <App />
                                        </QuestionEvaluationProvider>
                                      </GroupsProvider>
                                    </LabsProvider>
                                  </StudentProvider>
                                </ExamnsProvider>
                              </AnswersProvider>
                            </QuestionsProvider>
                          </ImportExcelQuestionsProvider>
                        </AreaProvider>
                      </CareerAssignProvider>
                    </ExtensionGestionProvider>
                  </PeriodProvider>
                </GestionProvider>
              </CareerProvider>
            </PersonaProvider>
          </UnitProvider>
        </UserProvider>
      </RolesProvider>
    </PermissionsProvider>
  </BrowserRouter >

)
